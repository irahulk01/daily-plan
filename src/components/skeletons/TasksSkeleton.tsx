import { Skeleton } from "./Skeleton";

export function TasksSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* 1:1 Tasks Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="w-44 h-8 rounded-2xl" />
          <Skeleton className="w-60 h-4 rounded-full" />
        </div>
        <Skeleton className="w-32 h-10 bg-[#D4E556]/20 rounded-2xl shrink-0" />
      </div>

      {/* 1:1 Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <Skeleton className="w-20 h-8 rounded-full bg-white/20" />
        <Skeleton className="w-28 h-8 rounded-full bg-emerald-500/20" />
        <Skeleton className="w-28 h-8 rounded-full bg-[#D4E556]/20" />
        <Skeleton className="w-28 h-8 rounded-full bg-rose-500/20" />
      </div>

      {/* 1:1 Timeline Card List */}
      <div className="flex flex-col gap-4 mt-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-5 rounded-[2.25rem] bg-[#3A393E] border border-white/10 shadow-xl min-h-[140px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-32 h-5 rounded-full" />
                  <Skeleton className="w-16 h-5 rounded-full" />
                </div>
                <Skeleton className="w-4/5 h-6 rounded-xl" />
                <Skeleton className="w-full h-4 rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black/5 mt-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-24 h-6 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
