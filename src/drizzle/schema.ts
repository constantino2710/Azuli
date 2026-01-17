import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  decimal,
  integer,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core';

// --- ENUMS ---
export const statusEnum = pgEnum('status', [
  'active',
  'inactive',
  'pending',
  'canceled',
]);
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'failed',
  'refunded',
]);

// --- CAMADA GLOBAL (SaaS) ---

export const saasUsers = pgTable('saas_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isSuperAdmin: boolean('is_super_admin').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  monthlyPrice: decimal('monthly_price', { precision: 10, scale: 2 }).notNull(),
  limits: text('limits'), // Pode ser alterado para jsonb se preferir
});

export const platforms = pgTable('platforms', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => saasUsers.id, { onDelete: 'cascade' }),
  subdomain: text('subdomain').notNull().unique(),
  customDomain: text('custom_domain').unique(),
  status: statusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  platformId: uuid('platform_id')
    .notNull()
    .unique()
    .references(() => platforms.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id')
    .notNull()
    .references(() => plans.id),
  status: statusEnum('status').default('active'),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
});

// --- CAMADA TENANT (Isolada por platform_id) ---

export const platformUsers = pgTable(
  'platform_users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    platformId: uuid('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    fullName: text('full_name').notNull(),
  },
  (t) => ({
    unqEmailPerPlatform: unique().on(t.platformId, t.email),
  }),
);

export const professors = pgTable(
  'professors',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    platformId: uuid('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => platformUsers.id, { onDelete: 'cascade' }),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),
  },
  (t) => ({
    unqProfessorPerPlatform: unique().on(t.platformId, t.userId),
  }),
);

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    platformId: uuid('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
  },
  (t) => ({
    unqSlugPerPlatform: unique().on(t.platformId, t.slug),
  }),
);

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  platformId: uuid('platform_id')
    .notNull()
    .references(() => platforms.id, { onDelete: 'cascade' }),
  professorId: uuid('professor_id')
    .notNull()
    .references(() => professors.id),
  categoryId: uuid('category_id').references(() => categories.id),
  title: text('title').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).default('0.00'),
  ratingAverage: decimal('rating_average').default('0.0'),
});

export const sections = pgTable('sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  platformId: uuid('platform_id')
    .notNull()
    .references(() => platforms.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  position: integer('position').notNull(),
});

export const lessons = pgTable('lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  platformId: uuid('platform_id')
    .notNull()
    .references(() => platforms.id, { onDelete: 'cascade' }),
  sectionId: uuid('section_id')
    .notNull()
    .references(() => sections.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content'),
  videoUrl: text('video_url'),
  durationSeconds: integer('duration_seconds').default(0),
  position: integer('position').notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  platformId: uuid('platform_id')
    .notNull()
    .references(() => platforms.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => platformUsers.id),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const enrollments = pgTable(
  'enrollments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    platformId: uuid('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => platformUsers.id),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id),
    status: statusEnum('status').default('active'),
    enrolledAt: timestamp('enrolled_at').defaultNow(),
  },
  (t) => ({
    unqEnrollment: unique().on(t.userId, t.courseId),
  }),
);
