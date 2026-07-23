import { db } from './src/db/index.js';
import { userTable } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

async function setAdmin() {
  const email = 'navasgranizo.ignacio@gmail.com';
  console.log(`Setting admin privileges for ${email}...`);
  await db.update(userTable).set({
    role: 'admin',
    clearanceLevel: 3
  }).where(eq(userTable.email, email));
  console.log('Done!');
}

setAdmin().catch(console.error);
