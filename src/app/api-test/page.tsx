import { db } from "@/lib/db";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function APITestPage() {
  let isConnected = false;
  let errorMsg = "";
  let tasksCount = 0;
  let projectsCount = 0;

  try {
    // Test the connection by counting documents
    tasksCount = await db.task.count();
    projectsCount = await db.project.count();
    isConnected = true;
  } catch (err: any) {
    errorMsg = err.message || "Failed to connect to MongoDB";
  }

  const routes = [
    { name: "GET All Tasks", path: "/api/tasks", description: "Fetch all tasks from the database" },
    { name: "GET All Projects", path: "/api/projects", description: "Fetch all projects from the database" },
    { name: "Server Action: Create Task", path: "src/actions/task.ts", description: "Used internally by the UI to create tasks" },
    { name: "Server Action: Toggle Task", path: "src/actions/task.ts", description: "Used internally by the UI to check/uncheck tasks" },
    { name: "Server Action: Delete Task", path: "src/actions/task.ts", description: "Used internally by the UI to delete tasks" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-3xl mx-auto pt-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-white/90 drop-shadow-sm">
          API & Database Status
        </h1>
        <p className="text-white/60">Diagnostic page to verify MongoDB connection and API routes.</p>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-2">
          MongoDB Connection
        </h2>
        
        {isConnected ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
              <span className="text-xl font-bold">Connected Successfully</span>
            </div>
            <div className="flex items-center gap-4 text-white/60">
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm">Tasks: {tasksCount}</span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm">Projects: {projectsCount}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-red-400">
              <XCircle className="h-8 w-8" />
              <span className="text-xl font-bold">Connection Failed</span>
            </div>
            <p className="text-red-300 text-sm font-mono bg-red-950/50 p-4 rounded-xl border border-red-500/20 overflow-x-auto">
              {errorMsg}
            </p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-3">
          Available Routes
          <div className="h-px bg-white/10 flex-1"></div>
        </h2>
        
        <div className="flex flex-col gap-3">
          {routes.map((route, i) => (
            <div key={i} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md p-5 hover:bg-white/10 transition-all duration-300 shadow-lg">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-white/90 text-base">{route.name}</span>
                <span className="text-sm text-white/40">{route.description}</span>
              </div>
              
              {route.path.startsWith("/") ? (
                <Link href={route.path} target="_blank" className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border text-blue-400 border-blue-400/20 bg-blue-400/10 hover:bg-blue-400/20 transition-colors self-start sm:self-auto shrink-0">
                  {route.path} ↗
                </Link>
              ) : (
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg border text-white/40 border-white/10 bg-white/5 self-start sm:self-auto shrink-0">
                  {route.path}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
