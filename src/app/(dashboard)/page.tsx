import { CalendarDays } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { TaskItem } from "@/components/TaskItem";
import { FocusSlider } from "@/components/FocusSlider";
import { DashboardTabs } from "@/components/DashboardTabs";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getSession();
  const today = new Date();
  
  // Fetch tasks scoped to the logged-in user
  const tasks = await db.task.findMany({
    where: session ? { userId: session.id } : {},
    include: { project: true },
    orderBy: { priority: 'desc' },
  });

  const todayTasks = tasks.filter((t: any) => {
    const createdToday = isSameDay(new Date(t.createdAt), today);
    const dueToday = t.dueDate ? isSameDay(new Date(t.dueDate), today) : false;
    return createdToday || dueToday;
  });
  
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

      {/* Top Hero Header Section — with background image */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-6 pb-12 overflow-hidden">
        {/* Background image — blurred and dark-tinted */}
        <div
          className="absolute inset-0 pointer-events-none scale-105"
          style={{
            backgroundImage: "url('/bg-home.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
            backgroundRepeat: "no-repeat",
            filter: "blur(8px) brightness(0.55)",
          }}
        />
        {/* Additional dark overlay for text contrast */}
        <div className="absolute inset-0 pointer-events-none bg-[#1A1A1E]/50" />
        {/* Bottom fade-out so section blends into the rest of the page */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-b from-transparent to-[#1C1C1E]" />

        {/* Modern High-End Dashboard Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 pb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4E556]/15 text-[#D4E556] text-xs font-black uppercase tracking-wider border border-[#D4E556]/30 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4E556]" />
                {format(today, "EEEE, MMM d")}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Good morning, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4E556] to-emerald-400">{session?.name?.split(" ")[0] ?? "there"}</span> 👋
            </h1>
            <p className="text-xs font-semibold text-[#A0A0A5]">
              You have <span className="text-white font-bold">{todayTasks.length} tasks</span> scheduled for today
            </p>
          </div>

          {/* High-End Glass Insight Badges */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <div className="flex items-center gap-2.5 p-2 px-4 rounded-2xl bg-[#3A393E] border border-white/10 shadow-md">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                {completedCount} Done
              </span>
              <span className="text-white/20">|</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#D4E556]">
                <span className="w-2 h-2 rounded-full bg-[#D4E556]" />
                {ongoingCount} Active
              </span>
              <span className="text-white/20">|</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#A0A0A5]">
                <span className="w-2 h-2 rounded-full bg-[#A0A0A5]" />
                {remainingCount} Left
              </span>
            </div>

            <div className="px-3.5 py-2.5 rounded-2xl bg-[#D4E556] text-[#1C1C1E] text-xs font-black shadow-lg shadow-[#D4E556]/10 flex items-center gap-1.5 shrink-0">
              🎯 {completionPercentage}%
            </div>
          </div>
        </div>
      </div>
      {/* end hero header section */}

      {/* Horizontal Swipeable Focus Task Slider */}
      <FocusSlider tasks={displayFocusTasks} />

      {/* Typography Tabs: Today's Schedule & Completed */}
      <DashboardTabs todayTasks={todayTasks} completedTasks={completedTasks} />
    </div>
  );
}
