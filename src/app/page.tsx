import { CalendarDays } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { db } from "@/lib/db";
import { TaskItem } from "@/components/TaskItem";
import { FocusSlider } from "@/components/FocusSlider";
import { DashboardTabs } from "@/components/DashboardTabs";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const today = new Date();
  
  // Fetch tasks and projects from the database
  const tasks = await db.task.findMany({
    include: { project: true },
    orderBy: { priority: 'desc' }, // simple ordering for now
  });

  const todayTasks = tasks.filter((t: any) => t.dueDate && isSameDay(new Date(t.dueDate), today));
  
  const now = new Date();
  const currentHour = now.getHours();
  const completedTasks = todayTasks.filter((t: any) => t.status === "Completed");
  const completedCount = completedTasks.length;
  const uncompletedTasks = todayTasks.filter((t: any) => t.status !== "Completed");
  
  // Ongoing tasks: uncompleted tasks scheduled up to or including the current hour
  const ongoingCount = uncompletedTasks.filter((t: any) => {
    if (t.status === "In Progress") return true;
    if (!t.dueDate) return false;
    const taskHour = new Date(t.dueDate).getHours();
    return taskHour <= currentHour;
  }).length;

  // Remaining tasks: upcoming uncompleted tasks scheduled for later today
  const remainingCount = Math.max(0, todayTasks.length - completedCount - ongoingCount);
  const completionPercentage = todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0;
  
  // Focus tasks for slider: important/high-priority tasks or top tasks today
  const focusTasks = todayTasks.filter((t: any) => t.isImportant || t.priority === 'High' || t.priority === 'Urgent');
  const displayFocusTasks = focusTasks.length > 0 ? focusTasks : todayTasks.slice(0, 3);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Ultra-Compact Header & Insights Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 md:mt-0">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#D4E556] text-[#1C1C1E] text-xs font-black uppercase tracking-widest shadow-sm">
              {format(today, "EEEE")}
            </span>
            <span className="text-xs font-bold text-[#A0A0A5] tracking-wider uppercase">
              {format(today, "yyyy")}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {format(today, "MMMM d")}
          </h1>
          
          <p className="text-xs font-semibold text-[#A0A0A5] mt-1">
            Good morning, Rahul • <span className="text-[#D4E556] font-bold">{todayTasks.length} tasks scheduled</span>
          </p>
        </div>

        {/* Streamlined Horizontal Insight Pills */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-extrabold border border-emerald-500/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {completedCount} Completed
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4E556]/10 text-[#D4E556] text-xs font-extrabold border border-[#D4E556]/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4E556] animate-pulse" />
            {ongoingCount} Ongoing
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#3A393E] text-white text-xs font-bold border border-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#A0A0A5]" />
            {remainingCount} Remaining
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4E556] text-[#1C1C1E] text-xs font-black shadow-sm">
            🎯 {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Horizontal Swipeable Focus Task Slider */}
      <FocusSlider tasks={displayFocusTasks} />

      {/* Typography Tabs: Today's Schedule & Completed */}
      <DashboardTabs todayTasks={todayTasks} completedTasks={completedTasks} />
    </div>
  );
}
