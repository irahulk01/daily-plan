"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calendar, 
  CheckSquare, 
  Inbox, 
  LayoutDashboard, 
  Star, 
  AlertCircle,
  Plus,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Today", href: "/", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "All Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Important", href: "/important", icon: Star },
  { name: "Overdue", href: "/overdue", icon: AlertCircle },
  { name: "Inbox", href: "/inbox", icon: Inbox },
];

export function Sidebar({ projects = [] }: { projects?: any[] }) {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col bg-black/20 backdrop-blur-3xl border-r border-white/5 min-h-screen">
      <div className="flex h-16 items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 font-semibold text-lg text-white">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white text-sm font-bold">DP</span>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-wide">Plan</span>
        </Link>
      </div>
      
      <div className="p-4">
        <Link href="?modal=create-task" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300">
          <Plus className="h-5 w-5" />
          Create
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto scrollbar-hide">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-white/10 text-white shadow-inner border border-white/5"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "text-white/40 group-hover:text-white/70"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}

        <div className="mt-8">
          <div className="px-3 text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-3">
            Projects
          </div>
          <div className="space-y-1">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group flex items-center rounded-xl px-3 py-2 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all duration-300"
              >
                <span className={cn("mr-3 h-2 w-2 rounded-full", project.color)} aria-hidden="true" />
                {project.name}
              </Link>
            ))}
            <Link
              href="/projects/new"
              className="group flex items-center rounded-xl px-3 py-2 text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all duration-300 mt-2"
            >
              <Plus className="mr-3 h-4 w-4 flex-shrink-0" />
              New Project
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
