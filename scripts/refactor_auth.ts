import fs from 'fs';
import path from 'path';

function getFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      if (filePath.endsWith('.astro')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const astroFiles = getFiles('./src/pages');

// Define the replacement logic
const adminRegex = /if \(\!user \|\| \(user\.role !== 'admin' && user\.role !== 'editor'\)\) \{([\s\S]*?)\}/g;
const canEditRegex = /const canEdit = user && \(user\.role === 'admin' \|\| user\.role === 'editor'\);/g;

astroFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // For canEdit pattern
  if (content.match(canEditRegex)) {
    if (!content.includes('import { authorize }')) {
      content = content.replace('---', "---\nimport { authorize } from '../../lib/authz';");
    }
    
    let resource = "'all'";
    if (file.includes('noticias')) resource = "'news'";
    else if (file.includes('agenda')) resource = "'event'";
    else if (file.includes('foros')) resource = "'forum'";

    content = content.replace(canEditRegex, `const canEdit = await authorize(user?.id, 'manage', ${resource});`);
    changed = true;
  }

  // For Admin block pattern
  if (content.match(adminRegex)) {
    // Normalizar a slashes para cálculo de profundidad
    const posixFile = file.replace(/\\/g, '/');
    const depth = posixFile.split('/').length - 2;
    let prefix = '../'.repeat(depth - 1) || './';
    
    if (!content.includes('import { authorize }')) {
      content = content.replace('---', `---\nimport { authorize } from '${prefix}lib/authz';`);
    }

    let resource = "'all'";
    if (posixFile.includes('/noticias')) resource = "'news'";
    else if (posixFile.includes('/agenda')) resource = "'event'";
    else if (posixFile.includes('/foros')) resource = "'forum'";

    content = content.replace(adminRegex, `const canManage = await authorize(user?.id, 'manage', ${resource});\nif (!canManage) {\n  return Astro.redirect('/');\n}`);
    changed = true;
  }
  
  if (content.includes('Nivel de Acceso: {user.role}')) {
    content = content.replace('Nivel de Acceso: {user.role}', 'Nivel de Acceso: PBAC');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Refactored auth in ${file}`);
  }
});
