import { db } from '../../../db';
import { userTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const biography = body.biography;

    if (typeof biography !== 'string') {
      return new Response(JSON.stringify({ error: 'Biografía inválida' }), { status: 400 });
    }

    // Limit length if desired (e.g. 500 chars)
    const sanitizedBio = biography.substring(0, 500);

    await db.update(userTable)
      .set({ biography: sanitizedBio })
      .where(eq(userTable.id, user.id));

    return new Response(JSON.stringify({ success: true, biography: sanitizedBio }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
};
