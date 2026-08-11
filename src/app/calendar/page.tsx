"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Bell, Calendar as CalendarIcon, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { TimelineCard } from "@/components/TimelineCard";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "PENDING" | "MISSED">("ALL");

  const { data: tasks = [] } = useTasks();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    return tasks.filter((t: any) => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate));
  }, [tasks, selectedDate]);

  // Status groupings
  const completedTasks = selectedDateTasks.filter((t: any) => t.status === "Completed");
  const pendingTasks = selectedDateTasks.filter((t: any) => t.status === "In Progress");
  const missedTasks = selectedDateTasks.filter((t: any) => t.status !== "Completed" && t.status !== "In Progress");

  // Filtered list based on selected tab
  const filteredTasks = useMemo(() => {
    if (statusFilter === "COMPLETED") return completedTasks;
    if (statusFilter === "PENDING") return pendingTasks;
    if (statusFilter === "MISSED") return missedTasks;
    return selectedDateTasks;
  }, [statusFilter, selectedDateTasks, completedTasks, pendingTasks, missedTasks]);

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#D4E556] flex items-center justify-center text-[#1C1C1E] shadow-sm">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Task Schedule</h1>
            <p className="text-xs font-semibold text-[#A0A0A5] mt-0.5">
              Browse previously generated tasks by date
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-[#3A393E] flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Month Navigation & Selected Date Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center justify-between bg-[#3A393E] p-2 px-4 rounded-full border border-white/10 shadow-sm w-max">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1 text-[#A0A0A5] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-extrabold text-white px-4">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1 text-[#A0A0A5] hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#3A393E] px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-white flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#D4E556]" />
          <span>Selected: {format(selectedDate, "EEE, MMM d, yyyy")}</span>
        </div>
      </div>

      {/* Interactive Circular Calendar Grid */}
      <div className="bg-[#3A393E] p-6 sm:p-8 rounded-[2.5rem] shadow-xl border border-white/5">
        <div className="grid grid-cols-7 text-center mb-6">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
            <span key={i} className="text-xs font-extrabold text-[#A0A0A5] uppercase tracking-wider">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 sm:gap-4 place-items-center">
          {daysInMonth.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const dayTasks = tasks.filter((t: any) => t.dueDate && isSameDay(new Date(t.dueDate), day));
            const hasCompleted = dayTasks.some((t: any) => t.status === "Completed");
            const hasPending = dayTasks.some((t: any) => t.status === "In Progress");
            const hasMissed = dayTasks.some((t: any) => t.status !== "Completed" && t.status !== "In Progress");

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center font-extrabold text-sm transition-all ${
                  isSelected
                    ? "bg-white text-[#1C1C1E] shadow-xl scale-105 ring-2 ring-[#D4E556]"
                    : isToday
                      ? "bg-[#D4E556] text-[#1C1C1E] shadow-md"
                      : dayTasks.length > 0
                        ? "border-2 border-dashed border-[#D4E556] text-white bg-[#424147]"
                        : "bg-[#2D2C30] text-[#A0A0A5] hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{format(day, "d")}</span>
                
                {/* Status dots on date cell */}
                {dayTasks.length > 0 && !isSelected && (
                  <div className="absolute bottom-1 flex items-center gap-0.5">
                    {hasCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    {hasPending && <span className="w-1.5 h-1.5 rounded-full bg-[#D4E556]" />}
                    {hasMissed && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Distinctly Colored Filter Tabs below Calendar */}
      <div className="flex flex-col gap-6 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Tasks for {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            <p className="text-xs font-semibold text-[#A0A0A5] mt-0.5">
              Showing {filteredTasks.length} of {selectedDateTasks.length} tasks
            </p>
          </div>

          {/* Distinctly Colored Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap bg-[#2D2C30] p-1.5 rounded-full border border-white/10 shadow-sm">
            {/* All */}
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                statusFilter === "ALL" 
                  ? "bg-white text-[#1C1C1E] shadow-md scale-105" 
                  : "text-[#A0A0A5] hover:text-white"
              }`}
            >
              All ({selectedDateTasks.length})
            </button>

            {/* Completed - Emerald Green */}
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                statusFilter === "COMPLETED" 
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105" 
                  : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed ({completedTasks.length})
            </button>

            {/* Pending / Ongoing - Lime Yellow */}
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                statusFilter === "PENDING" 
                  ? "bg-[#D4E556] text-[#1C1C1E] shadow-md shadow-[#D4E556]/30 scale-105" 
                  : "bg-[#D4E556]/10 text-[#D4E556] hover:bg-[#D4E556]/20"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Pending ({pendingTasks.length})
            </button>

            {/* Missed / Untouched - Vibrant Rose Red */}
            <button
              onClick={() => setStatusFilter("MISSED")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                statusFilter === "MISSED" 
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105" 
                  : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Missed ({missedTasks.length})
            </button>
          </div>
        </div>

        {/* Task Cards List Format (No Delete Button) */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-10 rounded-[2.25rem] bg-[#3A393E]/60 border border-white/5 text-center text-[#A0A0A5] text-sm font-medium"
              >
                No {statusFilter.toLowerCase()} tasks found for this date.
              </motion.div>
            ) : (
              filteredTasks.map((task: any) => (
                <TimelineCard key={task.id} task={task} hideDelete={true} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
