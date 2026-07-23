import { defineMiddleware } from 'astro:middleware';
import { lucia } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
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
