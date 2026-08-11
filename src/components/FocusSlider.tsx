"use client";

import { useState, useRef, useTransition } from "react";
import { format } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toggleTaskCompletion } from "@/actions/task";

interface FocusSliderProps {
  tasks: any[];
}

export function FocusSlider({ tasks }: FocusSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (!tasks || tasks.length === 0) return null;

  const handleToggle = (e: React.MouseEvent, taskId: string, currentStatus: string) => {
    e.stopPropagation();
    startTransition(() => {
      toggleTaskCompletion(taskId, currentStatus);
    });
  };

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handlePrev = () => {
    const nextIdx = activeIndex > 0 ? activeIndex - 1 : tasks.length - 1;
    scrollToCard(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = activeIndex < tasks.length - 1 ? activeIndex + 1 : 0;
    scrollToCard(nextIdx);
  };

  return (
    <section className="flex flex-col gap-3 -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-[#D4E556] flex items-center gap-1.5">
          <span className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">★</span> FOCUS & PRIORITY TASKS
        </h2>

        {tasks.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#A0A0A5] mr-1">
              {activeIndex + 1} / {tasks.length}
            </span>
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-full bg-[#3A393E] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              title="Previous task"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-full bg-[#3A393E] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              title="Next task"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Slider Carousel Container — peek px shows adjacent cards on both sides */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2 px-4 sm:px-6 lg:px-8">
          {tasks.map((task, index) => {
            const isActive = index === activeIndex;
            const isCompleted = task.status === "Completed";
            return (
              <motion.div
                key={task.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                onClick={() => scrollToCard(index)}
                animate={{
                  scale: isActive ? 1 : 0.94,
                  zIndex: isActive ? 20 : 1,
                  opacity: isActive ? 1 : 0.5,
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`snap-center shrink-0 rounded-[2.25rem] border transition-all duration-300 cursor-pointer p-5 sm:p-6 shadow-xl relative overflow-hidden group ${
                  isActive
                    ? "bg-[#3A393E] border-[#D4E556] shadow-[0_0_25px_rgba(212,229,86,0.25)] ring-2 ring-[#D4E556]/40"
                    : "bg-[#2D2C30] border-white/10"
                } ${isPending ? "opacity-50" : ""}`}
                style={{ width: "calc(100% - 2.5rem)" }}
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#D4E556]/10 blur-[80px] rounded-full group-hover:bg-[#D4E556]/20 transition-all duration-700" />
                
                <div className="relative z-10 flex flex-col justify-between gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => handleToggle(e, task.id, task.status)}
                        disabled={isPending}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
                          isCompleted
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                            : "bg-white/10 text-white/70 hover:bg-[#D4E556] hover:text-[#1C1C1E] shadow-sm"
                        }`}
                        title={isCompleted ? "Mark incomplete" : "Mark complete"}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#D4E556]/10 text-[#D4E556] text-[10px] font-black uppercase tracking-wider border border-[#D4E556]/30">
                        <Star className="w-3 h-3 fill-[#D4E556]" />
                        Focus #{index + 1}
                      </span>
                    </div>

                    {task.priority && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-white">
                        {task.priority}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug break-words">
                    {task.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#A0A0A5]">
                    {task.project && (
                      <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-white">
                        <div className={`w-2.5 h-2.5 rounded-full ${task.project.color?.split(' ')[0] || 'bg-white'}`}></div>
                        {task.project.name}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="flex items-center gap-1.5 bg-[#D4E556]/10 px-3 py-1 rounded-full text-[#D4E556] border border-[#D4E556]/30">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Due: Today · {format(new Date(task.dueDate), "h:mm a")}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
