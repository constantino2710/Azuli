/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_DB } from '../drizzle/drizzle.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';
import { CreateSaasUserDto } from './dto/create-saas-user.dto';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

@Injectable()
export class SaasUsersService {
  constructor(
    @Inject(DRIZZLE_DB) private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createUser(data: CreateSaasUserDto) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    const result = await this.db
      .insert(schema.saasUsers)
      .values({
        email: data.email,
        passwordHash: passwordHash,
        isSuperAdmin: data.isSuperAdmin || false,
      })
      .returning();

    const { passwordHash: _, ...userWithoutPassword } = result[0];
    return userWithoutPassword;
  }

  async findByEmail(email: string) {
    const users = await this.db
      .select()
      .from(schema.saasUsers)
      .where(eq(schema.saasUsers.email, email))
      .limit(1);

    return users[0];
  }
}
