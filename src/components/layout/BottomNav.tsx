"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, CheckSquare, FolderOpen, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Today", href: "/", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "More", href: "/more", icon: MoreHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
      <div className="flex justify-around items-center h-[68px] px-2 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300",
                isActive ? "text-white scale-110" : "text-white/50 hover:text-white/80"
              )}
            >
              <item.icon className={cn("h-[22px] w-[22px]", isActive ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
