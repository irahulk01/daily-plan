"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

export function FloatingCreateButton() {
  const pathname = usePathname();
  const isIdeasPage = pathname === "/ideas";
  const modalTarget = isIdeasPage ? "?modal=create-idea" : "?modal=create-task";
  const title = isIdeasPage ? "Create New Idea / Plan" : "Create New Task";

  return (
    <div className="md:hidden fixed bottom-24 right-6 z-50">
      <Link
        href={modalTarget}
        title={title}
        className="flex items-center justify-center w-14 h-14 bg-[#D4E556] text-[#1C1C1E] rounded-full shadow-xl hover:bg-[#C5D647] hover:scale-105 active:scale-95 transition-all border border-black/10"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </Link>
    </div>
  );
}
