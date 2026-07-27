import type { APIRoute } from 'astro';
import { db } from '../../db';
import { notificationTable } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const data = await request.json();
    const action = data.action; // 'read', 'archive', 'delete', 'readAll'
    const notificationId = data.id;

    if (action === 'readAll') {
      await db.update(notificationTable)
        .set({ isRead: true })
        .where(
          and(
            eq(notificationTable.userId, user.id),
            eq(notificationTable.isArchived, false)
          )
        );
      return new Response(JSON.stringify({ success: true }));
    }

    if (!notificationId) {
      return new Response(JSON.stringify({ error: 'Missing notification ID' }), { status: 400 });
    }

    if (action === 'read') {
      await db.update(notificationTable)
        .set({ isRead: true })
        .where(and(eq(notificationTable.id, notificationId), eq(notificationTable.userId, user.id)));
    } else if (action === 'archive') {
      await db.update(notificationTable)
        .set({ isArchived: true, isRead: true })
        .where(and(eq(notificationTable.id, notificationId), eq(notificationTable.userId, user.id)));
    } else if (action === 'delete') {
      await db.delete(notificationTable)
        .where(and(eq(notificationTable.id, notificationId), eq(notificationTable.userId, user.id)));
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
