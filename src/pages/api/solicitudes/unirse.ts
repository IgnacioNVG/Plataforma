import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { roleRequestTable } from '../../../db/schema';
import crypto from 'node:crypto';

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  try {
    const data = await request.json();
    const { organizationId, orgName } = data;

    if (!organizationId) {
      return new Response(JSON.stringify({ error: 'ID de organización requerido' }), { status: 400 });
    }

    const requestId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);

    await db.insert(roleRequestTable).values({
      id: requestId,
      organizationId,
      proposedTitle: 'Militante Base',
      proposedFunctionalArea: 'militante',
      requesterUserId: user.id,
      status: 'pending'
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Join request error:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor al procesar tu solicitud.' }), { status: 500 });
  }
};
