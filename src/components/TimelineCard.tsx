"use client";

import { CheckCircle2, Trash2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { toggleTaskCompletion, deleteTask } from "@/actions/task";
import { useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TimelineCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    dueDate: Date | null;
    priority: string;
    project: {
      name: string;
      color: string | null;
    } | null;
  };
  hideDelete?: boolean;
}

export function TimelineCard({ task, hideDelete = false }: TimelineCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(() => {
      toggleTaskCompletion(task.id, task.status);
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(() => {
      deleteTask(task.id);
    });
  };

  const isCompleted = task.status === 'Completed';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -20 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`group relative flex flex-col justify-between gap-4 rounded-[2.25rem] bg-[#ECEBE9] p-6 sm:p-7 text-[#1C1C1E] shadow-sm hover:shadow-xl transition-all duration-300 ${
        isPending ? 'opacity-40 scale-95 translate-x-2 grayscale' : ''
      }`}
    >
      {/* Top Bar: Due Date Badge + Priority Tag */}
      <div className="flex items-center justify-between gap-3">
        {task.dueDate ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 text-[#515055] text-xs font-semibold border border-black/5">
            <span className="text-xs">🗓️</span>
            <span>Due: Today · {format(new Date(task.dueDate), "h:mm a")}</span>
          </span>
        ) : <div />}

        {task.priority && (
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className={`px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shrink-0 shadow-sm ${
              task.priority === 'Urgent' ? 'bg-red-200 text-red-900' : 
              task.priority === 'High' ? 'bg-[#D4E556] text-[#1C1C1E]' : 
              'bg-black/5 text-[#515055]'
            }`}
          >
            {task.priority}
          </motion.span>
        )}
      </div>

      {/* Center Section: Main Title & Description */}
      <div className="flex flex-col gap-2 my-1">
        <h3 className={`font-extrabold text-2xl leading-snug break-words tracking-tight ${
          isCompleted ? 'text-[#8E8E93] line-through' : 'text-[#1C1C1E]'
        }`}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className="text-sm font-medium text-[#515055] leading-relaxed break-words whitespace-pre-wrap">
            {task.description}
          </p>
        )}
      </div>

      {/* Bottom Bar: Checkmark + Project Tag + Action Buttons */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 pt-3 sm:pt-4 border-t border-black/5 mt-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 overflow-hidden">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            disabled={isPending}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
              isCompleted 
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                : 'bg-white hover:bg-black/10 text-[#515055] hover:text-[#1C1C1E] shadow-sm'
            }`}
            title={isCompleted ? "Mark incomplete" : "Mark complete"}
          >
            <CheckCircle2 className={`h-5 w-5 sm:h-5 sm:w-5 transition-transform duration-300 ${isCompleted ? 'scale-110' : 'group-hover:scale-105'}`} />
          </motion.button>

          {task.project && (
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1 sm:gap-1.5 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm text-[10px] sm:text-xs font-bold text-[#1C1C1E] truncate max-w-[110px] sm:max-w-[150px]"
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${task.project.color?.split(' ')[0] || 'bg-slate-400'}`} />
              <span className="truncate">{task.project.name}</span>
            </motion.span>
          )}
        </div>

        {/* Action Buttons: Edit & Delete */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <motion.div whileHover={{ scale: 1.15, rotate: 6 }} whileTap={{ scale: 0.9 }}>
            <Link
              href={`?edit-task=${task.id}`}
              onClick={(e) => e.stopPropagation()}
              className="group/edit w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#1C1C1E] shadow-sm hover:bg-[#D4E556] hover:shadow-[0_0_15px_rgba(212,229,86,0.6)] flex items-center justify-center transition-all duration-300"
              title="Edit task details"
            >
              <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover/edit:rotate-12" />
            </Link>
          </motion.div>
          {!hideDelete && (
            <motion.div whileHover={{ scale: 1.15, rotate: -6 }} whileTap={{ scale: 0.9 }}>
              <button 
                onClick={handleDelete}
                disabled={isPending}
                className="group/delete w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#1C1C1E] shadow-sm hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center transition-all duration-300"
                title="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover/delete:-rotate-12" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
