import { db } from "@/lib/db";
import {
  MoreHorizontal,
  CheckSquare,
  Lightbulb,
  FolderKanban,
  Calendar,
  Settings,
  Bell,
  Smartphone,
  ShieldCheck,
  User,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MorePage() {
  const taskCount = await db.task.count();
  const completedTaskCount = await db.task.count({ where: { status: "Completed" } });
  
  let ideaCount = 0;
  try {
    const ideaDelegate = (db as any).idea;
    if (ideaDelegate) {
      ideaCount = await ideaDelegate.count();
    }
  } catch (err) {
    ideaCount = 0;
  }

  const projectCount = await db.project.count();

  const QUICK_LINKS = [
    {
      title: "All Tasks Feed",
      description: "Manage, filter, and review all tasks in one list",
      href: "/tasks",
      icon: CheckSquare,
      color: "bg-[#D4E556]/15 text-[#D4E556] border-[#D4E556]/30",
      badge: `${taskCount} Tasks`,
    },
    {
      title: "Ideas & Scratchpad",
      description: "Brainstorm raw thoughts, project plans, and notes",
      href: "/ideas",
      icon: Lightbulb,
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      badge: `${ideaCount} Ideas`,
    },
    {
      title: "Projects & Ideas",
      description: "Group tasks under projects and planning stages",
      href: "/projects",
      icon: FolderKanban,
      color: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      badge: `${projectCount} Projects`,
    },
    {
      title: "Full Calendar View",
      description: "Monthly timeline view with completed & missed filters",
      href: "/calendar",
      icon: Calendar,
      color: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      badge: "Monthly View",
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-1 mt-2 sm:mt-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <MoreHorizontal className="w-8 h-8 text-[#D4E556]" />
          More & Settings
        </h1>
        <p className="text-xs font-semibold text-[#A0A0A5]">
          App shortcuts, workspace statistics, and account preferences
        </p>
      </div>

      {/* User Profile Banner */}
      <div className="flex items-center justify-between p-6 rounded-[2.25rem] bg-[#3A393E] border border-white/10 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#D4E556]/10 blur-[80px] rounded-full group-hover:bg-[#D4E556]/20 transition-all duration-700" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4E556] to-emerald-400 text-[#1C1C1E] font-black text-xl flex items-center justify-center shadow-lg border-2 border-white/20">
            DP
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-extrabold text-white">Rahul</h2>
            <span className="text-xs font-semibold text-[#A0A0A5]">rahul@dailyplan.app</span>
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-black uppercase text-[#D4E556] tracking-wider">
              <Sparkles className="w-3 h-3 fill-[#D4E556]" /> Pro Workspace Member
            </span>
          </div>
        </div>

        <div className="relative z-10 hidden sm:flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-[#A0A0A5]">Completed</span>
            <span className="text-xl font-black text-[#D4E556]">{completedTaskCount} Tasks</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#A0A0A5] px-1">
          Quick Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="flex items-center justify-between p-5 rounded-[2rem] bg-[#3A393E] border border-white/10 hover:border-white/20 transition-all shadow-md group"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${link.color}`}>
                  <link.icon className="w-5.5 h-5.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-base font-extrabold text-white group-hover:text-[#D4E556] transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-xs text-[#A0A0A5] font-medium leading-tight">
                    {link.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-[#A0A0A5] border border-white/10">
                  {link.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-[#A0A0A5] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* App Preferences & Settings */}
      <div className="flex flex-col gap-3 mt-2">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#A0A0A5] px-1">
          Preferences & App Info
        </h2>
        <div className="flex flex-col rounded-[2rem] bg-[#3A393E] border border-white/10 divide-y divide-white/5 overflow-hidden shadow-lg">
          <div className="flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-all">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#D4E556]" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Daily Notifications & Reminders</span>
                <span className="text-xs text-[#A0A0A5]">Receive alerts for scheduled focus tasks</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Enabled
            </span>
          </div>

          <div className="flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-all">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-sky-400" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Progressive Web App (PWA)</span>
                <span className="text-xs text-[#A0A0A5]">Install on Mobile & Desktop home screen</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-sky-400 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
              App Ready
            </span>
          </div>

          <div className="flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-all">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Database Engine</span>
                <span className="text-xs text-[#A0A0A5]">Connected to task-planner MongoDB cluster</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              MongoDB Atlas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
