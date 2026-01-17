import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema.ts', // Caminho para o seu arquivo de schema
  out: './drizzle', // Pasta onde as migrações serão salvas
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://admin:admin123@localhost:5432/my_database', // Use sua URL do .env ou Docker
  },
});
