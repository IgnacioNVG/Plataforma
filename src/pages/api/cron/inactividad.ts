import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { userTable, notificationTable } from '../../../db/schema';
import { lte, eq, and, or, isNull, sql } from 'drizzle-orm';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Validate Secret Token
    const authHeader = request.headers.get('Authorization');
    const expectedToken = `Bearer ${env.CRON_SECRET || 'default-dev-secret'}`; 

    if (authHeader !== expectedToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // 2. Identify Inactive Users (lastLoginAt older than 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Si lastLoginAt es null, consideramos la fecha de creación (createdAt)
    const inactiveUsers = await db.select({
      id: userTable.id,
      name: userTable.name,
      lastLoginAt: userTable.lastLoginAt,
      createdAt: userTable.createdAt
    })
    .from(userTable)
    .where(
      and(
        eq(userTable.isActive, true),
        or(
          lte(userTable.lastLoginAt, sevenDaysAgo),
          and(isNull(userTable.lastLoginAt), lte(userTable.createdAt, sevenDaysAgo))
        )
      )
    )
    .all();

    let notifiedCount = 0;
    const now = new Date();
    const notificationTitle = '¡Te extrañamos en la Plataforma!';

    // 3. Process each user and avoid spamming
    for (const user of inactiveUsers) {
      // Check if we already sent an inactivity reminder recently (e.g., in the last 6 days)
      const sixDaysAgo = new Date();
      sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

      const recentNotif = await db.select()
        .from(notificationTable)
        .where(
          and(
            eq(notificationTable.userId, user.id),
            eq(notificationTable.title, notificationTitle),
            lte(notificationTable.createdAt, now),
            // The createdAt column uses mode: 'timestamp' which maps to standard Date objects
            // In SQLite via Drizzle, it's stored as an integer timestamp.
            sql`${notificationTable.createdAt} >= ${sixDaysAgo.getTime()}`
          )
        )
        .limit(1)
        .all();

      if (recentNotif.length === 0) {
        // Send notification
        await db.insert(notificationTable).values({
          id: crypto.randomUUID(),
          userId: user.id,
          title: notificationTitle,
          content: `Hola ${user.name}, hemos notado que no has ingresado en los últimos 7 días. ¡Vuelve a la plataforma para no perder tu racha orgánica y enterarte de las novedades!`,
          priority: 'media',
          label: 'Sistema',
          isRead: false,
          isArchived: false,
          link: '/perfil',
          createdAt: new Date()
        });
        notifiedCount++;
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: inactiveUsers.length,
      notifiedCount 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en Cron Inactividad:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
