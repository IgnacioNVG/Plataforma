import { Lucia } from 'lucia';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import { createClient } from '@libsql/client';

const client = createClient({ url: 'file:local_dev.db' });
const adapter = new LibSQLAdapter(client, {
  user: 'user',
  session: 'session'
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: import.meta.env?.PROD ?? false
    }
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      name: attributes.name,
      lastName: attributes.last_name,
      avatarUrl: attributes.avatar_url,
        passwordHash: attributes.password_hash,
      isActive: Boolean(attributes.is_active)
    };
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  name: string;
  last_name: string;
  avatar_url: string | null;
  password_hash: string;
  rut_hash: string;
  is_active: number | boolean;
}
