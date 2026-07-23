import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  // Ya no usamos URL local. Para generar migraciones basta con el dialecto.
  // Las aplicaciones a D1 se hacen vía Wrangler CLI.
  verbose: true,
  strict: true,
});
