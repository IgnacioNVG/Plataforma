import { db } from './src/db/index.js';
import { userTable } from './src/db/schema.js';

async function checkUser() {
  const users = await db.select().from(userTable);
  console.log(users.map(u => ({ email: u.email, role: u.role, clearanceLevel: u.clearanceLevel })));
}

checkUser().catch(console.error);
