export default function MoreLoading() {
  return (
    <div className="flex flex-col gap-6 pb-16 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-1.5">
        <div className="w-48 h-8 bg-white/15 rounded-2xl" />
        <div className="w-64 h-4 bg-white/10 rounded-full" />
      </div>

      {/* Profile Card Skeleton */}
      <div className="h-32 w-full bg-[#3A393E] rounded-[2.25rem] border border-white/5 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/15" />
          <div className="flex flex-col gap-2">
            <div className="w-32 h-6 bg-white/15 rounded-xl" />
            <div className="w-40 h-3.5 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Grid Shortcuts Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-[#3A393E] rounded-[2rem] border border-white/5 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/10" />
              <div className="flex flex-col gap-1.5">
                <div className="w-32 h-5 bg-white/15 rounded-lg" />
                <div className="w-44 h-3 bg-white/10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
