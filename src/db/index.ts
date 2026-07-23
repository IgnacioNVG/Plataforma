import { drizzle } from 'drizzle-orm/d1';
import { AsyncLocalStorage } from 'node:async_hooks';

// Almacén asíncrono para mantener la conexión D1 aislada por cada petición web
export const dbStorage = new AsyncLocalStorage<any>();

// Exportamos un Proxy global. Así no tenemos que modificar los 23 archivos que importan `db`.
// Cada vez que un archivo llame a `db.select()`, el proxy lo redirigirá a la conexión D1 de la petición actual.
export const db = new Proxy({}, {
  get(target, prop) {
    const store = dbStorage.getStore();
    if (!store) {
      // Fallback a console warn para evitar crasheos si se lee fuera del contexto (ej: build estático)
      console.warn("Intentando acceder a DB fuera del contexto de una petición");
      return () => ({}); 
    }
    return store[prop];
  }
}) as any;
