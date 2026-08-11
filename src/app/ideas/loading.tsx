export default function IdeasLoading() {
  return (
    <div className="flex flex-col gap-6 pb-16 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="w-48 h-8 bg-white/15 rounded-2xl" />
          <div className="w-64 h-4 bg-white/10 rounded-full" />
        </div>
        <div className="w-36 h-10 bg-[#D4E556]/20 rounded-full" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-44 bg-[#3A393E] rounded-[2rem] border border-white/5 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-20 h-6 bg-white/10 rounded-full" />
              <div className="w-8 h-8 rounded-full bg-white/10" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-3/4 h-6 bg-white/15 rounded-xl" />
              <div className="w-full h-4 bg-white/10 rounded-full" />
            </div>
            <div className="w-28 h-3.5 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
