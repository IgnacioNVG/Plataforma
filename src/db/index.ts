import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

// Astro/Vite expone las variables de entorno aquí. En Cloudflare Pages provienen de la pestaña Settings > Environment Variables.
const dbUrl = import.meta.env.TURSO_DATABASE_URL || 'file:local_dev.db';
const dbAuthToken = import.meta.env.TURSO_AUTH_TOKEN;

const client = createClient({ 
  url: dbUrl,
  ...(dbAuthToken ? { authToken: dbAuthToken } : {})
});

export const db = drizzle(client);
