import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { roleRequestTable, appointmentTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    const { requestId, status } = await request.json();

    if (!requestId || !['approved', 'rejected'].includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }

    const reqData = await db.select().from(roleRequestTable).where(eq(roleRequestTable.id, requestId)).get();
    if (!reqData) {
      return new Response(JSON.stringify({ error: 'Request not found' }), { status: 404 });
    }

    // Actualizar solicitud
    await db.update(roleRequestTable)
      .set({ 
        status, 
        resolvedAt: new Date(), 
        resolvedByUserId: user.id 
      })
      .where(eq(roleRequestTable.id, requestId));

    // Si es aprobado, crear appointment
    if (status === 'approved') {
      const aptId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      await db.insert(appointmentTable).values({
        id: aptId,
        userId: reqData.requesterUserId,
        organizationId: reqData.organizationId,
        positionTypeId: 'militante-base', // Simplified
        startDate: new Date(),
        status: 'activo'
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Resolve request error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
