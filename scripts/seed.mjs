import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.routine.deleteMany();

  console.log('Creating projects...');
  const project1 = await prisma.project.create({
    data: {
      name: 'Personal Portfolio',
      color: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
      status: 'Active',
      priority: 'High',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Expense Tracker',
      color: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]',
      status: 'Planning',
      priority: 'Medium',
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Learning',
      color: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]',
      status: 'Active',
      priority: 'Medium',
    },
  });

  console.log('Creating tasks...');
  const today = new Date();
  today.setHours(10, 0, 0, 0);

  const evening = new Date();
  evening.setHours(19, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  await prisma.task.create({
    data: {
      title: 'Finish portfolio hero section',
      projectId: project1.id,
      priority: 'High',
      status: 'In Progress',
      dueDate: today,
      isImportant: true,
      tags: ['frontend', 'design'],
    },
  });

  await prisma.task.create({
    data: {
      title: 'Build portfolio layout',
      projectId: project1.id,
      priority: 'Medium',
      status: 'Completed',
      completedAt: new Date(),
    },
  });

  await prisma.task.create({
    data: {
      title: 'Study JavaScript closures',
      projectId: project3.id,
      priority: 'Medium',
      status: 'Todo',
      dueDate: evening,
      isImportant: false,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Fix auth bug',
      projectId: project2.id,
      priority: 'Urgent',
      status: 'Todo',
      dueDate: tomorrow,
      isImportant: true,
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
