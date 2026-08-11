"use client";

import { CheckCircle2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toggleTaskCompletion, deleteTask } from "@/actions/task";
import { useTransition } from "react";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    status: string;
    dueDate: Date | null;
    priority: string;
    project: {
      name: string;
      color: string | null;
    } | null;
  };
}

export function TaskItem({ task }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      toggleTaskCompletion(task.id, task.status);
    });
  };

  const handleDelete = () => {
    startTransition(() => {
      deleteTask(task.id);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return "text-red-500 border-red-500/20 bg-red-500/10";
      case 'High': return "text-orange-400 border-orange-400/20 bg-orange-400/10";
      default: return "text-blue-400 border-blue-400/20 bg-blue-400/10";
    }
  };

  return (
    <div className={`group flex items-start sm:items-center gap-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md p-4 sm:p-5 hover:bg-white/10 transition-all duration-300 shadow-lg ${isPending ? 'opacity-50' : ''}`}>
      <button 
        onClick={handleToggle}
        disabled={isPending}
        className={`mt-1 sm:mt-0 transition-colors shrink-0 ${task.status === 'Completed' ? 'text-emerald-400' : 'text-white/20 hover:text-blue-400'}`}
      >
        <CheckCircle2 className="h-7 w-7" />
      </button>
      
      <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className={`font-semibold text-base transition-all ${task.status === 'Completed' ? 'text-white/40 line-through' : 'text-white/90'}`}>
            {task.title}
          </span>
          <div className="flex items-center gap-2 text-xs text-white/40">
            {task.project && (
              <span className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${task.project.color?.split(' ')[0] || 'bg-white'}`}></div>
                {task.project.name}
              </span>
            )}
            {task.project && task.dueDate && <span className="text-white/20">•</span>}
            {task.dueDate && <span>{format(new Date(task.dueDate), "h:mm a")}</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </div>
          
          <a
            href={`?edit-task=${task.id}`}
            className="text-white/20 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </a>
          
          <button 
            onClick={handleDelete}
            disabled={isPending}
            className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
