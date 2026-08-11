const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  console.log("--- Users ---");
  const users = await db.user.findMany();
  console.log(JSON.stringify(users, null, 2));

  console.log("\n--- Tasks (last 5) ---");
  const tasks = await db.task.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  console.log(JSON.stringify(tasks, null, 2));

  console.log("\n--- Ideas (last 3) ---");
  const ideas = await db.idea.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
  console.log(JSON.stringify(ideas, null, 2));

  console.log("\n--- Projects ---");
  const projects = await db.project.findMany();
  console.log(JSON.stringify(projects, null, 2));

  await db.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
