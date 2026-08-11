import { CheckSquare } from "lucide-react";
import { db } from "@/lib/db";
import { TaskItem } from "@/components/TaskItem";

export const dynamic = 'force-dynamic';

export default async function AllTasks() {
  const tasks = await db.task.findMany({
    include: { project: true },
    orderBy: [
      { status: 'asc' },
      { priority: 'desc' },
      { dueDate: 'asc' }
    ]
  });

  const todoTasks = tasks.filter((t: any) => t.status !== "Completed");
  const completedTasks = tasks.filter((t: any) => t.status === "Completed");

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-2 mt-4 md:mt-0">
        <h1 className="text-4xl font-bold tracking-tight text-white/90 drop-shadow-sm flex items-center gap-4">
          <CheckSquare className="h-10 w-10 text-blue-400" />
          All Tasks
        </h1>
        <p className="text-white/60 text-sm mt-1">
          {todoTasks.length} pending · {completedTasks.length} completed
        </p>
      </div>

      {todoTasks.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-3">
            Pending Tasks
            <div className="h-px bg-white/10 flex-1"></div>
          </h2>
          <div className="flex flex-col gap-3">
            {todoTasks.map((task: any) => <TaskItem key={task.id} task={task} />)}
          </div>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section className="opacity-70">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-3">
            Completed
            <div className="h-px bg-white/10 flex-1"></div>
          </h2>
          <div className="flex flex-col gap-3">
            {completedTasks.map((task: any) => <TaskItem key={task.id} task={task} />)}
          </div>
        </section>
      )}
    </div>
  );
}
