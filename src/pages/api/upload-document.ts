import type { APIRoute } from 'astro';
import { documentTable } from '../../db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto'; // Solo para generar uuid local si fuera Node, en CF usamos crypto nativo
// Corrección para Cloudflare:
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback simple si no está
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { STORAGE } = locals.runtime.env;
    const db = locals.db;

    // --- RATE LIMIT: Max 5 docs por usuario al día ---
    const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    // No podemos usar SQL functions complejas fácilmente en Drizzle-ORM SQLite base sin cast
    // Una alternativa es traer los docs del usuario y filtrarlos en memoria (son pocos al día)
    const userDocs = await db.select().from(documentTable).where(eq(documentTable.authorId, user.id)).all();
    const docsToday = userDocs.filter(d => {
      const docDate = d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : '';
      return docDate === todayStr;
    });

    if (docsToday.length >= 5) {
      return new Response(JSON.stringify({ error: 'Has alcanzado el límite de 5 subidas diarias. Intenta mañana.' }), { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('document') as File | null;
    const youtubeUrl = formData.get('youtubeUrl') as string | null;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const clearanceLevel = parseInt(formData.get('clearanceLevel') as string || '1', 10);
    // Para simplificar, asignaremos una organización genérica si no hay una. En un sistema real vendría del form.
    const organizationId = formData.get('organizationId') as string || 'nacional_id_fake_for_now'; 
    
    if (!title || !category) {
      return new Response(JSON.stringify({ error: 'Falta título o categoría' }), { status: 400 });
    }

    const hasFile = file && file.size > 0 && file.name;
    const hasYoutube = youtubeUrl && youtubeUrl.trim().length > 0;

    if (!hasFile && !hasYoutube) {
      return new Response(JSON.stringify({ error: 'Debes adjuntar un archivo o ingresar una URL de YouTube.' }), { status: 400 });
    }

    let fileUrl = '';
    
    const docId = generateId();

    if (hasFile) {
      const allowedTypes = [
        'application/pdf',
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-powerpoint', // .ppt
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
      ];

      if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({ error: 'Formato no soportado. Sube PDF o archivos de Office.' }), { status: 400 });
      }
      
      // Extraer extensión real
      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const fileName = `docs/${docId}.${ext}`;

      // Upload to R2
      const arrayBuffer = await file.arrayBuffer();
      await STORAGE.put(fileName, arrayBuffer, {
        httpMetadata: { contentType: file.type }
      });

      fileUrl = `/api/storage/${fileName}`;
    }

    // Insert into DB
    await db.insert(documentTable).values({
      id: docId,
      title,
      fileUrl,
      youtubeUrl: hasYoutube ? youtubeUrl : null,
      category,
      authorId: user.id,
      organizationId,
      clearanceLevel
    });

    return new Response(JSON.stringify({ success: true, docId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload document' }), { status: 500 });
  }
};
