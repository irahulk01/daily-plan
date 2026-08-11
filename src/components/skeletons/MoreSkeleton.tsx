import { Skeleton } from "./Skeleton";

export function MoreSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* 1:1 Header Skeleton */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="w-56 h-8 rounded-2xl" />
        <Skeleton className="w-72 h-4 rounded-full" />
      </div>

      {/* 1:1 User Profile Banner Skeleton */}
      <div className="h-32 w-full bg-[#3A393E] rounded-[2.25rem] border border-white/10 p-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4E556]/30 to-emerald-400/30" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-32 h-6 rounded-xl" />
            <Skeleton className="w-44 h-3.5 rounded-full" />
          </div>
        </div>
      </div>

      {/* 1:1 Grid Options Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-[#3A393E] rounded-[2rem] border border-white/10 p-5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3.5">
              <Skeleton className="w-11 h-11 rounded-2xl bg-white/10" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="w-32 h-5 rounded-lg" />
                <Skeleton className="w-44 h-3 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
