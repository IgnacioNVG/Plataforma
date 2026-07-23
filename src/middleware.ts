import { defineMiddleware } from 'astro:middleware';
import { initializeLucia, luciaStorage } from './lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import { dbStorage } from './db';

export const onRequest = defineMiddleware(async (context, next) => {
  const d1 = context.locals.runtime?.env?.DB;
  if (!d1) {
    console.warn("D1 Database binding 'DB' not found in context.locals.runtime.env");
    return next();
  }

  const db = drizzle(d1);
  context.locals.db = db;

  const lucia = initializeLucia(db);
  context.locals.lucia = lucia;

  // Corremos el resto del middleware (y todas las rutas de Astro) dentro del contexto de los ALSes
  return dbStorage.run(db, () => {
    return luciaStorage.run(lucia, async () => {
      // Ahora `db` y `lucia` importados globalmente apuntan a estas instancias!

      const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
      
      let user = null;
      let session = null;

      if (sessionId) {
        const result = await lucia.validateSession(sessionId);
        session = result.session;
        user = result.user;

        if (session && session.fresh) {
          const sessionCookie = lucia.createSessionCookie(session.id);
          context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
        if (!session) {
          const sessionCookie = lucia.createBlankSessionCookie();
          context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
      }

      context.locals.session = session;
      context.locals.user = user;

      // RUTAS PÚBLICAS Y ASSETS QUE NO REQUIEREN AUTENTICACIÓN
      const publicRoutes = ['/login', '/validacion'];
      const isPublicAsset = context.url.pathname.startsWith('/_astro') || 
                            context.url.pathname.startsWith('/api/') || 
                            context.url.pathname.includes('.'); // ej: .svg, .png, .css

      if (!user && !publicRoutes.includes(context.url.pathname) && !isPublicAsset) {
        return context.redirect('/login');
      }

      return next();
    });
  });
});
