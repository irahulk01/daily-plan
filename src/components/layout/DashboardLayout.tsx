import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";
import { CreateTaskModal } from "../CreateTaskModal";
import { db } from "@/lib/db";
import { Suspense } from "react";

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const projects = await db.project.findMany({
    select: { id: true, name: true, color: true },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="flex h-screen overflow-hidden bg-black relative selection:bg-blue-500/30">
      {/* Cool mesh gradient background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex h-full w-full">
        {/* Sidebar for desktop */}
        <Sidebar projects={projects} />

        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          {/* Top Navigation */}
          <Topbar />

          {/* Main Content Area */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none pb-24 md:pb-8 scroll-smooth scrollbar-hide">
            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Navigation */}
        <BottomNav />
      </div>

      {/* Global Modals */}
      <Suspense fallback={null}>
        <CreateTaskModal projects={projects} />
      </Suspense>
    </div>
  );
}
