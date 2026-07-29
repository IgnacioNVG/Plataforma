import type { APIRoute } from 'astro';
import { userTable } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    const { STORAGE } = locals.runtime.env;
    
    // Generate a unique file name
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `avatars/${user.id}.${ext}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await STORAGE.put(fileName, arrayBuffer, {
      httpMetadata: { contentType: file.type }
    });

    // Generate public-facing URL via our storage API
    const avatarUrl = `/api/storage/${fileName}?t=${Date.now()}`;

    // Update DB
    const db = locals.db;
    await db.update(userTable)
      .set({ avatarUrl })
      .where(eq(userTable.id, user.id));

    return new Response(JSON.stringify({ success: true, avatarUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload avatar' }), { status: 500 });
  }
};
