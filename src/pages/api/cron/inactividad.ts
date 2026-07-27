import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { notificationTable, userTable, enrollmentTable, moduleProgressTable, courseTable } from '../../../db/schema';
import { eq, inArray, isNull, and, sql } from 'drizzle-orm';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  // Simple auth con token para evitar ejecuciones públicas
  const authHeader = request.headers.get('Authorization');
  const cronSecret = env.CRON_SECRET || 'default-dev-secret';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    // Lógica para detectar inactividad:
    // Buscar enrolamientos que NO tienen progreso en los últimos 7 días.
    // Esto requeriría una query más compleja. Por simplicidad para el prototipo:
    
    // Obtenemos a los usuarios que están inscritos en cursos obligatorios
    // Y no han completado nada. (Simplificación lógica)
    
    // Aquí podrías insertar notificaciones recordatorias si es necesario.
    // Ejemplo ilustrativo:
    // const usersToRemind = await db...
    
    // Simulamos que se inyectan notificaciones:
    const randomUsers = await db.select({ id: userTable.id }).from(userTable).limit(5);
    
    const notifications = randomUsers.map(u => ({
      id: crypto.randomUUID(),
      userId: u.id,
      title: "Recordatorio de Actividad",
      content: "Hemos notado que llevas tiempo sin avanzar en tus cursos obligatorios. ¡Retoma tus estudios!",
      priority: "media" as 'alta'|'media'|'baja',
      label: "Sistema",
      scheduledFor: null,
    }));
    
    if (notifications.length > 0) {
      await db.insert(notificationTable).values(notifications);
    }
    
    return new Response(JSON.stringify({ success: true, notificados: notifications.length }));
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
