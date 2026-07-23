import { lucia } from './src/lib/auth.js';
import { db } from './src/db/index.js';
import { sessionTable, userTable } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

async function testAuth() {
  const [session] = await db.select().from(sessionTable);
  if (!session) {
    console.log('No sessions found in DB.');
    return;
  }
  const { user, session: luciaSession } = await lucia.validateSession(session.id);
  console.log('User from Lucia:', user);
}

testAuth().catch(console.error);
