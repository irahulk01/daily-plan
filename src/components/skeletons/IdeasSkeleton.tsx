import { Skeleton } from "./Skeleton";

export function IdeasStackSkeleton() {
  return (
    <div className="flex flex-col relative pt-2 pb-16 mt-2">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          style={{
            marginTop: index === 0 ? "0px" : "-6rem",
          }}
          className="flex flex-col justify-between p-6 rounded-[2.25rem] bg-[#3A393E] border-2 border-white/10 shadow-2xl relative h-[210px]"
        >
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="w-20 h-6 rounded-full bg-[#D4E556]/20" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-7 h-7 rounded-xl" />
              <Skeleton className="w-7 h-7 rounded-xl" />
            </div>
          </div>

          <div className="flex flex-col gap-2 my-2">
            <Skeleton className="w-3/4 h-7 rounded-xl" />
            <Skeleton className="w-full h-4 rounded-full" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <Skeleton className="w-28 h-4 rounded-full" />
            <Skeleton className="w-24 h-4 rounded-full bg-[#D4E556]/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function IdeasSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="w-56 h-8 rounded-2xl" />
          <Skeleton className="w-72 h-4 rounded-full" />
        </div>
        <Skeleton className="w-36 h-10 bg-[#D4E556]/20 rounded-2xl shrink-0" />
      </div>

      <IdeasStackSkeleton />
    </div>
  );
}
