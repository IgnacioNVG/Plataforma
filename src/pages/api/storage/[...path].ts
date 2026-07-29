import type { APIRoute } from 'astro';
import { documentTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params, locals }) => {
  const path = params.path; // e.g., "avatars/123.jpg" or "docs/456.pdf"
  
  if (!path) {
    return new Response('Not found', { status: 404 });
  }

  const { STORAGE } = locals.runtime.env;

  // -- LOGICA DE PERMISOS (RBAC) --
  if (path.startsWith('docs/')) {
    // Es un documento protegido. Verificamos sesión y permisos
    const user = locals.user;
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const db = locals.db;
    const docId = path.split('/')[1].replace('.pdf', '');

    const doc = await db.select().from(documentTable).where(eq(documentTable.id, docId)).get();
    
    if (!doc) {
      return new Response('Document not found in DB', { status: 404 });
    }

    if (user.baseClearance < doc.clearanceLevel) {
      return new Response('Forbidden: Insufficient Clearance Level', { status: 403 });
    }
  }

  // Obtener el objeto de R2
  const object = await STORAGE.get(path);

  if (object === null) {
    return new Response('Object not found in R2', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  
  const fileName = path.split('/').pop() || 'document';
  
  if (path.endsWith('.pdf')) {
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `inline; filename="${fileName}"`);
  } else if (path.endsWith('.docx')) {
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
  } else if (path.endsWith('.doc')) {
    headers.set('Content-Type', 'application/msword');
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
  } else if (path.endsWith('.pptx')) {
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
  } else if (path.endsWith('.ppt')) {
    headers.set('Content-Type', 'application/vnd.ms-powerpoint');
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
  } else if (path.endsWith('.xlsx')) {
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
  } else if (path.endsWith('.xls')) {
    headers.set('Content-Type', 'application/vnd.ms-excel');
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
  } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
    headers.set('Content-Type', 'image/jpeg');
  } else if (path.endsWith('.png')) {
    headers.set('Content-Type', 'image/png');
  } else {
    // Default fallback for other attachments
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
  }

  // Set cache headers to reduce R2 reads for public avatars
  if (path.startsWith('avatars/')) {
    headers.set('Cache-Control', 'public, max-age=3600');
  }

  return new Response(object.body as any, {
    headers,
  });
};
