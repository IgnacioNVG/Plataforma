import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { roleRequestTable } from '../../../db/schema';
import crypto from 'crypto';
import { authorize } from '../../../lib/authz';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const organizationId = formData.get('organizationId')?.toString();
  const proposedTitle = formData.get('proposedTitle')?.toString();
  const proposedFunctionalArea = formData.get('proposedFunctionalArea')?.toString();

  if (!organizationId || !proposedTitle || !proposedFunctionalArea) {
    return new Response('Missing fields', { status: 400 });
  }

  // Verificar que el usuario tenga permisos (ya sea orgánico o general) para proponer cargos en esa org
  const canManage = await authorize(user.id, 'manage', 'organization', 'interno', organizationId);
  if (!canManage) {
    return new Response('Forbidden', { status: 403 });
  }

  await db.insert(roleRequestTable).values({
    id: crypto.randomUUID(),
    organizationId,
    proposedTitle,
    proposedFunctionalArea,
    requesterUserId: user.id,
    status: 'pending'
  });

  return redirect('/directorio?msg=solicitud_enviada');
};
