import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    // A simple validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Only images and PDFs allowed.' }), { status: 400 });
    }

    const { STORAGE } = locals.runtime.env;
    
    // Generate a unique file name
    const ext = file.name.split('.').pop() || 'bin';
    // attach/uuid.ext
    const fileName = `attach/${crypto.randomUUID()}.${ext}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await STORAGE.put(fileName, arrayBuffer, {
      httpMetadata: { contentType: file.type }
    });

    // Generate public-facing URL via our storage API
    const url = `/api/storage/${fileName}`;

    return new Response(JSON.stringify({ success: true, url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload attachment' }), { status: 500 });
  }
};
