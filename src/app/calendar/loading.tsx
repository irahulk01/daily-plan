export default function CalendarLoading() {
  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#D4E556]/20" />
          <div className="flex flex-col gap-1.5">
            <div className="w-40 h-7 bg-white/15 rounded-xl" />
            <div className="w-56 h-3.5 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Month Navigation & Selected Date Summary Skeleton */}
      <div className="flex flex-row items-center justify-between gap-2 w-full">
        <div className="w-36 h-9 bg-[#3A393E] rounded-full border border-white/5" />
        <div className="w-40 h-9 bg-[#3A393E] rounded-full border border-white/5" />
      </div>

      {/* Circular Calendar Grid Skeleton */}
      <div className="bg-[#3A393E] p-5 sm:p-7 rounded-[2.25rem] border border-white/5 flex flex-col gap-4">
        <div className="grid grid-cols-7 text-center">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-4 w-8 mx-auto bg-white/10 rounded-full" />
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2.5 sm:gap-3.5 place-items-center">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10" />
          ))}
        </div>
      </div>

      {/* Filter & Task List Skeleton */}
      <div className="flex flex-col gap-4 mt-1">
        <div className="flex items-center justify-between">
          <div className="w-48 h-6 bg-white/15 rounded-xl" />
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-7 bg-[#3A393E] rounded-full border border-white/5" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 w-full bg-[#3A393E]/60 rounded-3xl border border-white/5 p-4" />
          ))}
        </div>
      </div>
    </div>
  );
}
