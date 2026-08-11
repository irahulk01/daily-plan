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
              {/* Left Column: Time Pill & Node */}
              <div className="flex items-center gap-2 shrink-0 pt-3">
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full tracking-wide shadow-sm text-center min-w-[3.75rem] sm:min-w-[4.25rem] ${
                  isCurrentHour 
                    ? 'bg-[#D4E556] text-[#1C1C1E] font-black shadow-[0_0_10px_rgba(212,229,86,0.4)]' 
                    : 'bg-[#3A393E] text-white border border-white/10'
                }`}>
                  {displayTime}
                </span>
                <div className={`rounded-full border-2 shrink-0 ${
                  isCurrentHour 
                    ? 'w-4 h-4 bg-[#D4E556] border-[#D4E556] shadow-[0_0_12px_rgba(212,229,86,0.8)] animate-pulse' 
                    : 'w-3.5 h-3.5 bg-[#3A393E] border-[#D4E556]'
                }`} />
              </div>

              {/* Right Column: Cards Container */}
              <div className={`flex-1 min-w-0 p-4 sm:p-5 rounded-3xl transition-all duration-200 ${
                isCurrentHour 
                  ? 'bg-[#D4E556]/5 border-l-2 border-l-[#D4E556]' 
                  : 'bg-white/5 border-l-2 border-l-transparent hover:border-l-[#D4E556]'
              }`}>
                {/* NOW Badge if current hour */}
                {isCurrentHour && (
                  <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4E556] text-[#1C1C1E] text-xs font-extrabold tracking-wider uppercase shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#1C1C1E] animate-ping" />
                    NOW / Ongoing
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
