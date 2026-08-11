export default function TasksLoading() {
  return (
    <div className="flex flex-col gap-6 pb-16 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="w-40 h-8 bg-white/15 rounded-2xl" />
          <div className="w-56 h-4 bg-white/10 rounded-full" />
        </div>
        <div className="w-32 h-10 bg-[#D4E556]/20 rounded-full" />
      </div>

      {/* List Skeletons */}
      <div className="flex flex-col gap-3 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 w-full bg-[#3A393E] rounded-3xl border border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10" />
              <div className="flex flex-col gap-1.5">
                <div className="w-48 h-5 bg-white/15 rounded-lg" />
                <div className="w-28 h-3.5 bg-white/10 rounded-full" />
              </div>
            </div>
            <div className="w-16 h-6 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
