"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Lightbulb, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Today", href: "/", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
  { name: "More", href: "/more", icon: MoreHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <div className="flex justify-around items-center h-14 px-3 w-full max-w-sm rounded-full bg-[#2D2C30]/35 backdrop-blur-3xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 py-1 rounded-full",
                isActive
                  ? "text-[#D4E556]"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-all duration-300",
                  isActive ? "drop-shadow-[0_0_8px_rgba(212,229,86,0.6)] scale-110" : ""
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn("text-[10px] tracking-tight transition-all", isActive ? "font-extrabold text-[#D4E556]" : "font-semibold")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
