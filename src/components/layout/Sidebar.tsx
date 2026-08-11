"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calendar, 
  Inbox, 
  LayoutDashboard, 
  Star, 
  AlertCircle,
  Plus,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Today", href: "/", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
  { name: "Important", href: "/important", icon: Star },
  { name: "Overdue", href: "/overdue", icon: AlertCircle },
  { name: "Inbox", href: "/inbox", icon: Inbox },
];

export function Sidebar({ projects = [] }: { projects?: any[] }) {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col bg-[#3A393E] min-h-screen">
      <div className="flex h-16 items-center px-6 mt-4">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-white">
          <div className="w-10 h-10 rounded-full bg-[#D4E556] flex items-center justify-center">
            <span className="text-[#1C1C1E] text-sm font-black">DP</span>
          </div>
          <span className="tracking-wide">Plan</span>
        </Link>
      </div>
      
      <div className="p-6">
        <Link href="?modal=create-task" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#D4E556] hover:bg-[#C5D647] px-4 py-3.5 text-sm font-bold text-[#1C1C1E] shadow-sm transition-all duration-300">
          <Plus className="h-5 w-5" />
          Create
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-2 overflow-y-auto scrollbar-hide">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 mb-1",
                isActive
                  ? "bg-[#D4E556] text-[#1C1C1E] shadow-md"
                  : "text-[#A0A0A5] hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-[#1C1C1E]" : "text-[#A0A0A5] group-hover:text-white"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}

        <div className="mt-10">
          <div className="px-4 text-xs font-bold uppercase tracking-wider text-[#A0A0A5] mb-4">
            Ideas
          </div>
          <div className="space-y-1">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group flex items-center rounded-full px-4 py-3 text-sm font-semibold text-[#A0A0A5] hover:bg-white/5 hover:text-white transition-all duration-300 mb-1"
              >
                <span className={cn("mr-3 h-2.5 w-2.5 rounded-full", project.color)} aria-hidden="true" />
                {project.name}
              </Link>
            ))}
            <Link
              href="/projects/new"
              className="group flex items-center rounded-full px-4 py-3 text-sm font-semibold text-[#A0A0A5] hover:bg-white/5 hover:text-white transition-all duration-300 mt-2"
            >
              <div className="mr-3 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-[#D4E556] group-hover:text-[#1C1C1E] transition-all">
                <Plus className="h-3 w-3 flex-shrink-0" />
              </div>
              New Idea
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
