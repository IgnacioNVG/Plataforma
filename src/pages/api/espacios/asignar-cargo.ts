import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { appointmentTable, positionTypeTable } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'node:crypto';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user) return redirect('/login');

  try {
    const formData = await request.formData();
    const targetUserId = formData.get('userId')?.toString();
    const organizationId = formData.get('organizationId')?.toString();
    const positionTypeId = formData.get('positionTypeId')?.toString();

    if (!targetUserId || !organizationId || !positionTypeId) {
      return new Response('Faltan datos', { status: 400 });
    }

    // Autorización: Verificar si el usuario que ejecuta la acción es secretariado de la organización
    const myAppointment = await db.select()
      .from(appointmentTable)
      .where(and(
        eq(appointmentTable.userId, user.id),
        eq(appointmentTable.organizationId, organizationId),
        eq(appointmentTable.status, 'activo')
      ))
      .get();

    if (!myAppointment) {
      return new Response('No tienes permisos en este espacio', { status: 403 });
    }

    const myPosition = await db.select().from(positionTypeTable).where(eq(positionTypeTable.id, myAppointment.positionTypeId)).get();
    if (!myPosition || (myPosition.functionalArea === 'militante' || myPosition.functionalArea === 'general')) {
       return new Response('No tienes cargo de secretariado para asignar roles', { status: 403 });
    }

    // Actualizar el rol del targetUserId en la organización
    // Primero buscar si ya tiene un appointment activo
    const targetAppt = await db.select()
      .from(appointmentTable)
      .where(and(
        eq(appointmentTable.userId, targetUserId),
        eq(appointmentTable.organizationId, organizationId),
        eq(appointmentTable.status, 'activo')
      ))
      .get();

    if (targetAppt) {
      // Actualizar el nombramiento existente
      await db.update(appointmentTable)
        .set({ positionTypeId })
        .where(eq(appointmentTable.id, targetAppt.id));
    } else {
      // Crear uno nuevo (aunque si está en la lista debería tener uno)
      const aptId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
      await db.insert(appointmentTable).values({
        id: aptId,
        userId: targetUserId,
        organizationId,
        positionTypeId,
        startDate: new Date(),
        status: 'activo'
      });
    }

    return redirect(`/espacios/${organizationId}`);
  } catch (error) {
    console.error('Assign role error:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
};
