import { db } from './src/db/index.js';
import { newsTable } from './src/db/schema.js';

async function main() {
  const news = await db.select().from(newsTable);
  console.log(news.map(n => ({ id: n.id, title: n.title, slug: n.slug })));
}

main().catch(console.error);
