import { Skeleton } from "./Skeleton";

export function CalendarGridSkeleton() {
  return (
    <div className="bg-[#3A393E] p-5 sm:p-7 rounded-[2.25rem] shadow-xl border border-white/5 flex flex-col gap-4">
      <div className="grid grid-cols-7 text-center mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <span key={i} className="text-xs font-extrabold text-[#A0A0A5] uppercase tracking-wider">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2.5 sm:gap-3.5 place-items-center">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full bg-[#D4E556]/20" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-44 h-8 rounded-2xl" />
            <Skeleton className="w-64 h-3.5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Month Navigation & Selected Date Summary */}
      <div className="flex flex-row items-center justify-between gap-2 w-full">
        <Skeleton className="w-36 h-9 rounded-full bg-[#3A393E] border border-white/10" />
        <Skeleton className="w-40 h-9 rounded-full bg-[#3A393E] border border-white/10" />
      </div>

      <CalendarGridSkeleton />
    </div>
  );
}
