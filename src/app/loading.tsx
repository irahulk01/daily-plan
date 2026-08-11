export default function Loading() {
  return (
    <div className="flex flex-col gap-6 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 pb-2">
        <div className="flex flex-col gap-2">
          <div className="w-32 h-6 bg-white/10 rounded-full" />
          <div className="w-56 h-8 bg-white/15 rounded-2xl" />
          <div className="w-40 h-4 bg-white/10 rounded-full" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-48 h-10 bg-[#3A393E] rounded-2xl border border-white/5" />
          <div className="w-16 h-10 bg-[#D4E556]/20 rounded-2xl" />
        </div>
      </div>

      {/* Focus Slider Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="w-32 h-5 bg-white/10 rounded-full" />
          <div className="w-12 h-5 bg-white/10 rounded-full" />
        </div>

        <div className="h-44 w-full bg-[#3A393E] rounded-[2.25rem] border border-white/5 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-24 h-6 bg-white/10 rounded-full" />
            <div className="w-20 h-6 bg-white/10 rounded-full" />
          </div>
          <div className="w-3/4 h-8 bg-white/15 rounded-xl" />
          <div className="flex items-center justify-between">
            <div className="w-32 h-4 bg-white/10 rounded-full" />
            <div className="w-8 h-8 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* Tabs & List Skeleton */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-4">
          <div className="w-32 h-7 bg-white/15 rounded-full" />
          <div className="w-28 h-7 bg-white/10 rounded-full" />
        </div>

        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full bg-[#3A393E]/60 rounded-3xl border border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10" />
                <div className="flex flex-col gap-1.5">
                  <div className="w-48 h-5 bg-white/15 rounded-lg" />
                  <div className="w-24 h-3.5 bg-white/10 rounded-full" />
                </div>
              </div>
              <div className="w-16 h-6 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
