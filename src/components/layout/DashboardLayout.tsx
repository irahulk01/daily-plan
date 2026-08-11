import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";
import { CreateTaskModal } from "../CreateTaskModal";
import { CreateIdeaModal } from "../CreateIdeaModal";
import { FloatingCreateButton } from "../FloatingCreateButton";
import { db } from "@/lib/db";
import { Suspense } from "react";

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const projects = await db.project.findMany({
    select: { id: true, name: true, color: true },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="flex h-screen overflow-hidden relative bg-[#515055] text-white">
      {/* Warm charcoal background */}
      <div className="relative z-10 flex h-full w-full">
        {/* Sidebar for desktop */}
        <Sidebar projects={projects} />

        <div className="flex flex-col flex-1 w-0 h-full overflow-hidden">
          {/* Main Content Area with Sticky Glass Topbar */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none pb-24 md:pb-8 scroll-smooth scrollbar-hide">
            <Topbar />
            <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Navigation */}
        <BottomNav />

        {/* Smart Floating Action Button (FAB) */}
        <FloatingCreateButton />
      </div>

      {/* Global Modals */}
      <Suspense fallback={null}>
        <CreateTaskModal projects={projects} />
        <CreateIdeaModal />
      </Suspense>
    </div>
  );
}
