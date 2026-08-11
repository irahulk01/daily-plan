"use client";

import { useMemo } from "react";
import Link from "next/link";
import { TimelineCard } from "./TimelineCard";
import { format, setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineViewProps {
  tasks: any[];
}

export function TimelineView({ tasks }: TimelineViewProps) {
  const today = new Date();
  const currentHour = today.getHours();

  // Generate 24 hours starting from the current hour at the top
  const hours = useMemo(() => {
    const list = [];
    for (let i = 0; i < 24; i++) {
      list.push((currentHour + i) % 24);
    }
    return list;
  }, [currentHour]);

  // Group tasks by hour
  const tasksByHour = useMemo(() => {
    const grouped: Record<number, any[]> = {};
    hours.forEach(hour => grouped[hour] = []);
    
    tasks.forEach(task => {
      if (task.dueDate) {
        const hour = new Date(task.dueDate).getHours();
        if (grouped[hour] !== undefined) {
          grouped[hour].push(task);
        }
      }
    });
    
    return grouped;
  }, [tasks, hours]);

  // Filter to only hours that have tasks OR are the current hour
  const visibleHours = useMemo(() => {
    return hours.filter(hour => hour === currentHour || (tasksByHour[hour] && tasksByHour[hour].length > 0));
  }, [hours, currentHour, tasksByHour]);

  return (
    <div className="flex flex-col gap-5 mt-6 pb-12 w-full max-w-full overflow-hidden">
      <AnimatePresence mode="popLayout">
        {visibleHours.map(hour => {
          const hourTasks = tasksByHour[hour];
          const hasTasks = hourTasks.length > 0;
          const displayTime = format(setHours(today, hour), "h a");
          const isCurrentHour = hour === currentHour;
          const targetDate = setMilliseconds(setSeconds(setMinutes(setHours(today, hour), 0), 0), 0);
          
          return (
            <motion.div 
              key={hour} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex items-start gap-3 sm:gap-4 w-full max-w-full group"
            >
              {/* Left Column: Ultra-Compact Time Badge & Dot */}
              <div className="flex items-center gap-1.5 shrink-0 pt-2">
                <span className={`text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-md tracking-tight shadow-sm text-center shrink-0 ${
                  isCurrentHour 
                    ? 'bg-[#D4E556] text-[#1C1C1E]' 
                    : 'bg-[#3A393E] text-white/80 border border-white/10'
                }`}>
                  {displayTime}
                </span>
                <div className={`rounded-full shrink-0 ${
                  isCurrentHour 
                    ? 'w-2.5 h-2.5 bg-[#D4E556]' 
                    : 'w-2 h-2 bg-[#A0A0A5]'
                }`} />
              </div>

              {/* Right Column: Full-Width Cards Container */}
              <div className="flex-1 min-w-0 flex flex-col gap-3">
                {/* NOW Badge if current hour */}
                {isCurrentHour && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4E556] text-[#1C1C1E] text-[10px] font-black tracking-wider uppercase shadow-sm self-start">
                    NOW
                  </div>
                )}

                {/* Tasks for this hour */}
                <div className="flex flex-col gap-4 w-full min-w-0">
                  <AnimatePresence mode="popLayout">
                    {hourTasks.map(task => (
                      <TimelineCard key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                  
                  {/* Empty state / add button for current hour if no tasks yet */}
                  {!hasTasks && isCurrentHour && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link 
                        href={`?modal=create-task&date=${targetDate.toISOString()}`}
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-[#D4E556]/50 text-[#D4E556] bg-[#D4E556]/10 hover:bg-[#D4E556]/20 text-xs font-semibold transition-all w-max max-w-full truncate"
                      >
                        <Plus className="w-4 h-4 shrink-0" />
                        <span className="truncate">Add task for current hour ({displayTime})</span>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
