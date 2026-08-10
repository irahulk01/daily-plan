import { CalendarDays } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { db } from "@/lib/db";
import { TaskItem } from "@/components/TaskItem";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const today = new Date();
  
  // Fetch tasks and projects from the database
  const tasks = await db.task.findMany({
    include: { project: true },
    orderBy: { priority: 'desc' }, // simple ordering for now
  });

  const todayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), today));
  const completedCount = todayTasks.filter(t => t.status === "Completed").length;
  
  // Focus task: first important task or highest priority today
  const focusTask = todayTasks.find(t => t.isImportant) || todayTasks[0];
  
  const morningTasks = todayTasks.filter(t => new Date(t.dueDate!).getHours() < 17 && t.id !== focusTask?.id);
  const eveningTasks = todayTasks.filter(t => new Date(t.dueDate!).getHours() >= 17 && t.id !== focusTask?.id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return "text-red-500 border-red-500/20 bg-red-500/10";
      case 'High': return "text-orange-400 border-orange-400/20 bg-orange-400/10";
      default: return "text-blue-400 border-blue-400/20 bg-blue-400/10";
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col gap-2 mt-4 md:mt-0">
        <h1 className="text-4xl font-bold tracking-tight text-white/90 drop-shadow-sm">
          {format(today, "EEEE, MMMM d")}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-white/60 text-sm mt-1">
          <span className="font-medium text-white/80">Good morning, Rahul</span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span>You have {todayTasks.length} tasks today</span>
          <span className="text-white/20">•</span>
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs border border-white/5">{completedCount} completed · {todayTasks.length - completedCount} remaining</span>
        </div>
      </div>

      {/* Focus Section */}
      {focusTask && (
      <section>
        <div className="mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50 flex items-center gap-2">
            <span className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">★</span> FOCUS
          </h2>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-400/20 transition-all duration-700" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-white/90">{focusTask.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                {focusTask.project && (
                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${focusTask.project.color?.split(' ')[0] || 'bg-white'}`}></div>
                  {focusTask.project.name}
                </span>
                )}
                {focusTask.dueDate && (
                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 text-red-300">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Due: Today · {format(new Date(focusTask.dueDate), "h:mm a")}
                </span>
                )}
              </div>
            </div>
            <button className="whitespace-nowrap rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 backdrop-blur-md self-start sm:self-auto hover:scale-105 active:scale-95">
              Start Task
            </button>
          </div>
        </div>
      </section>
      )}

      {/* Today's Tasks */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-6">Today's Schedule</h2>
        
        <div className="flex flex-col gap-8">
          {/* Group: Morning */}
          {morningTasks.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center gap-3">
              Morning
              <div className="h-px bg-white/10 flex-1"></div>
            </h3>
            <div className="flex flex-col gap-3">
              {morningTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
          )}

          {/* Group: Evening */}
          {eveningTasks.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center gap-3">
              Evening
              <div className="h-px bg-white/10 flex-1"></div>
            </h3>
            <div className="flex flex-col gap-3">
              {eveningTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
          )}
        </div>
      </section>
    </div>
  );
}
