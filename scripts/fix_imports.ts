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

astroFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const posixFile = file.replace(/\\/g, '/');
  
  // Calculate exactly how many "../" we need to reach "src/"
  // E.g., src/pages/admin/agenda/crear.astro -> depth = 4. Needs 3 "../"
  const parts = posixFile.split('/');
  // parts[0] = '.', parts[1] = 'src', parts[2] = 'pages', parts[3] = 'admin', parts[4] = 'agenda', parts[5] = 'crear.astro'
  // Or without leading './', parts[0] = 'src', parts[1] = 'pages'
  // Let's just find the index of 'src'
  const srcIndex = parts.indexOf('src');
  const distanceToSrc = parts.length - srcIndex - 2; // -1 for filename, -1 because src itself is 0 steps
  const correctPrefix = distanceToSrc > 0 ? '../'.repeat(distanceToSrc) : './';

  // We find any import of authz and replace its path
  const importRegex = /import\s+\{\s*authorize\s*\}\s+from\s+['"]([^'"]+)['"]/g;
  
  content = content.replace(importRegex, (match, p1) => {
    changed = true;
    return `import { authorize } from '${correctPrefix}lib/authz'`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed import in ${file} to ${correctPrefix}lib/authz`);
  }
});
