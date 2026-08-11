"use client";

import { useState } from "react";
import { TimelineView } from "./TimelineView";
import { TimelineCard } from "./TimelineCard";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardTabsProps {
  todayTasks: any[];
  completedTasks: any[];
}

export function DashboardTabs({ todayTasks, completedTasks }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"SCHEDULE" | "COMPLETED">("SCHEDULE");

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Sleek Typography Tabs (Not button UI) */}
      <div className="flex items-center gap-8 border-b border-white/10 pb-4">
        {/* Today's Schedule Tab */}
        <button
          onClick={() => setActiveTab("SCHEDULE")}
          className="relative py-1 text-left transition-colors duration-200"
        >
          <span className={`text-xl sm:text-2xl font-extrabold tracking-tight transition-colors ${
            activeTab === "SCHEDULE" ? "text-white" : "text-[#A0A0A5] hover:text-white/80"
          }`}>
            Today's Schedule
          </span>
          <span className={`ml-2.5 px-2.5 py-0.5 rounded-full text-xs font-black ${
            activeTab === "SCHEDULE" ? "bg-[#D4E556] text-[#1C1C1E]" : "bg-[#3A393E] text-[#A0A0A5]"
          }`}>
            {todayTasks.length}
          </span>

          {activeTab === "SCHEDULE" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute -bottom-4 left-0 right-0 h-1 bg-[#D4E556] rounded-full shadow-[0_0_12px_rgba(212,229,86,0.8)]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        {/* Completed Tab */}
        <button
          onClick={() => setActiveTab("COMPLETED")}
          className="relative py-1 text-left transition-colors duration-200"
        >
          <span className={`text-xl sm:text-2xl font-extrabold tracking-tight transition-colors ${
            activeTab === "COMPLETED" ? "text-[#D4E556]" : "text-[#A0A0A5] hover:text-white/80"
          }`}>
            Completed
          </span>
          <span className={`ml-2.5 px-2.5 py-0.5 rounded-full text-xs font-black ${
            activeTab === "COMPLETED" ? "bg-emerald-500 text-white" : "bg-[#3A393E] text-[#A0A0A5]"
          }`}>
            {completedTasks.length}
          </span>

          {activeTab === "COMPLETED" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute -bottom-4 left-0 right-0 h-1 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Tab Content Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "SCHEDULE" ? (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TimelineView tasks={todayTasks} />
          </motion.div>
        ) : (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-12"
          >
            {completedTasks.length === 0 ? (
              <div className="col-span-full p-12 rounded-[2.25rem] bg-[#3A393E]/60 border border-white/5 text-center text-[#A0A0A5] text-sm font-medium">
                No tasks completed yet today. Finish a task on your schedule to see it here!
              </div>
            ) : (
              completedTasks.map(task => (
                <TimelineCard key={task.id} task={task} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
