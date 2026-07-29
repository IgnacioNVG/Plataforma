import { db } from '../db';
import { userActivityTable, appointmentTable, userTable } from '../db/schema';
import { eq, inArray, desc } from 'drizzle-orm';

/**
 * Registra una nueva actividad en el perfil del usuario.
 */
export async function logUserActivity(
  userId: string,
  actionType: 'document_uploaded' | 'course_completed' | 'forum_posted' | 'news_published',
  title: string,
  link?: string,
  organizationId?: string,
  classification: 'publico' | 'interno' | 'reservado' | 'confidencial' = 'publico'
) {
  await db.insert(userActivityTable).values({
    id: crypto.randomUUID(),
    userId,
    actionType,
    title,
    link,
    organizationId: organizationId || null,
    classification
  });
}

/**
 * Obtiene el Feed de Actividad de un usuario objetivo (targetUserId) 
 * filtrado por los permisos del usuario que está mirando (viewerId).
 */
export async function getUserActivityFeed(targetUserId: string, viewerId: string) {
  // 1. Obtener todas las actividades del usuario objetivo
  const allActivities = await db.select()
    .from(userActivityTable)
    .where(eq(userActivityTable.userId, targetUserId))
    .orderBy(desc(userActivityTable.createdAt))
    .limit(50); // Límite razonable

  // 2. Si el visor es el mismo usuario, lo ve todo.
  if (targetUserId === viewerId) {
    return allActivities;
  }

  // 3. Si el visor es otro, determinar sus accesos
  const viewer = await db.select().from(userTable).where(eq(userTable.id, viewerId)).get();
  if (!viewer) return [];

  // Obtener a qué organizaciones pertenece activamente el visor
  const viewerAppointments = await db.select()
    .from(appointmentTable)
    .where(eq(appointmentTable.userId, viewerId))
    .all();
    
  const activeOrgIds = new Set(
    viewerAppointments
      .filter(a => a.status === 'activo')
      .map(a => a.organizationId)
  );

  const viewerClearance = viewer.baseClearance || 1; // 1=publico, 2=interno, etc.
  const clearanceMap: Record<string, number> = {
    'publico': 1,
    'interno': 2,
    'reservado': 3,
    'confidencial': 4
  };

  // 4. Filtrar las actividades
  const filteredActivities = allActivities.filter(activity => {
    // Regla 1: Nivel de Clasificación
    const reqClearance = clearanceMap[activity.classification] || 1;
    if (viewerClearance < reqClearance) {
      return false; // El visor no tiene suficiente clearance
    }

    // Regla 2: Organización Específica
    // Si la actividad está ligada a una organización (ej. Acta Comité Central),
    // el visor debe pertenecer a dicha organización.
    if (activity.organizationId) {
      if (!activeOrgIds.has(activity.organizationId)) {
        // Excepción: Quizás los de clearance 4 (Confidencial/SuperAdmin) pueden ver todo, 
        // pero por ahora mantenemos estricta la membresía a la org.
        return false; 
      }
    }

    return true;
  });

  return filteredActivities;
}
