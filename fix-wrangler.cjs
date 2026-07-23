const fs = require('fs');
const path = 'dist/server/wrangler.json';

if (fs.existsSync(path)) {
  try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (data.assets) {
      console.log('Removing ASSETS binding from wrangler.json to fix Cloudflare Pages CI...');
      delete data.assets;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }
  } catch(e) {
    console.error('Error fixing wrangler.json:', e);
  }
}
