import { Skeleton } from "./Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1:1 Dashboard Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 pb-2 border-b border-white/5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Skeleton className="w-32 h-6 rounded-full bg-[#D4E556]/15 border border-[#D4E556]/30" />
          </div>
          <Skeleton className="w-64 sm:w-80 h-9 rounded-2xl" />
          <Skeleton className="w-48 h-4 rounded-full" />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2.5 p-2 px-4 rounded-2xl bg-[#3A393E] border border-white/10 shadow-md">
            <Skeleton className="w-16 h-4 rounded-full" />
            <span className="text-white/20">|</span>
            <Skeleton className="w-16 h-4 rounded-full" />
            <span className="text-white/20">|</span>
            <Skeleton className="w-14 h-4 rounded-full" />
          </div>
          <Skeleton className="w-20 h-9 rounded-2xl bg-[#D4E556]/30" />
        </div>
      </div>

      {/* 1:1 Focus Task Slider Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <Skeleton className="w-36 h-5 rounded-full" />
          <Skeleton className="w-16 h-5 rounded-full" />
        </div>

        <div className="w-full flex justify-center py-2">
          <div className="w-full max-w-md h-[185px] rounded-[2.25rem] bg-[#3A393E] border-2 border-white/15 p-6 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <Skeleton className="w-28 h-6 rounded-full bg-[#D4E556]/20" />
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-3/4 h-7 rounded-xl" />
              <Skeleton className="w-full h-4 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <Skeleton className="w-28 h-4 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 1:1 Dashboard Tabs & Timeline Cards Skeleton */}
      <div className="flex flex-col gap-5 mt-2">
        <div className="flex items-center gap-3 border-b border-white/5 pb-2">
          <Skeleton className="w-36 h-8 rounded-full bg-white/20" />
          <Skeleton className="w-32 h-8 rounded-full" />
        </div>

        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
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
    </div>
  );
}
