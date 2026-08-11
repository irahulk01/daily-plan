const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  // Clean old unlinked data (user chose "Start fresh")
  console.log("Deleting old tasks...");
  await db.task.deleteMany({ where: { userId: null } });
  
  console.log("Deleting old ideas...");
  await db.idea.deleteMany({ where: { userId: null } });
  
  console.log("Deleting old projects...");
  await db.project.deleteMany({ where: { userId: null } });

  console.log("✅ Fresh start complete! All old unlinked data removed.");
  
  const user = await db.user.findFirst();
  console.log("Current user:", user?.name, user?.email, "id:", user?.id);

  await db.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
