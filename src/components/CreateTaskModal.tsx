"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createTask, editTask, getTask } from "@/actions/task";
import { format } from "date-fns";

export function CreateTaskModal({ projects }: { projects: { id: string, name: string, color: string | null }[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const isCreateOpen = searchParams.get("modal") === "create-task";
  const editTaskId = searchParams.get("edit-task");
  const isOpen = isCreateOpen || !!editTaskId;
  
  const [isPending, startTransition] = useTransition();
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (editTaskId) {
      setIsLoadingData(true);
      getTask(editTaskId).then(res => {
        if (res.success) {
          setInitialData(res.data);
        }
        setIsLoadingData(false);
      });
    } else {
      setInitialData(null);
    }
  }, [editTaskId]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push(pathname);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      projectId: formData.get("projectId") as string || null,
      priority: formData.get("priority") as string,
      dueDate: formData.get("dueDate") as string || null,
      isImportant: formData.get("isImportant") === "on",
    };

    startTransition(async () => {
      if (editTaskId) {
        await editTask(editTaskId, data);
      } else {
        await createTask(data);
      }
      handleOpenChange(false);
    });
  };

  const formattedDate = initialData?.dueDate 
    ? new Date(initialData.dueDate).toISOString().slice(0, 16) 
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black/60 backdrop-blur-3xl border-white/10 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{editTaskId ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        {isLoadingData ? (
          <div className="py-10 text-center text-white/50 animate-pulse">Loading task...</div>
        ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-xs font-semibold uppercase tracking-widest text-white/50">Task Title</label>
            <input 
              required
              name="title" 
              id="title" 
              autoFocus
              defaultValue={initialData?.title || ""}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="What needs to be done?" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="projectId" className="text-xs font-semibold uppercase tracking-widest text-white/50">Project</label>
            <select 
              name="projectId" 
              id="projectId"
              defaultValue={initialData?.projectId || ""}
              className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
            >
              <option value="">No Project (Inbox)</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="dueDate" className="text-xs font-semibold uppercase tracking-widest text-white/50">Due Date & Time</label>
              <input 
                type="datetime-local" 
                name="dueDate" 
                id="dueDate"
                defaultValue={formattedDate}
                className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="priority" className="text-xs font-semibold uppercase tracking-widest text-white/50">Priority</label>
              <select 
                name="priority" 
                id="priority" 
                defaultValue={initialData?.priority || "Medium"}
                className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input 
              type="checkbox" 
              name="isImportant" 
              id="isImportant"
              defaultChecked={initialData?.isImportant || false}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0"
            />
            <label htmlFor="isImportant" className="text-sm font-medium text-white/80">Mark as important (⭐ Focus)</label>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="mt-4 w-full rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 py-3.5 font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98]"
          >
            {isPending ? "Saving..." : (editTaskId ? "Update Task" : "Create Task")}
          </button>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
