import { Lucia } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { sessionTable, userTable } from '../db/schema';
import { AsyncLocalStorage } from 'node:async_hooks';

// Almacén asíncrono aislar la instancia de Lucia por petición
export const luciaStorage = new AsyncLocalStorage<Lucia>();

export const lucia = new Proxy({}, {
  get(target, prop) {
    const store = luciaStorage.getStore();
    if (!store) {
      console.warn("Intentando acceder a Lucia fuera del contexto de una petición");
      return () => ({}); 
    }
    return (store as any)[prop];
  }
}) as unknown as Lucia;

export function initializeLucia(db: any) {
  const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
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
}

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
