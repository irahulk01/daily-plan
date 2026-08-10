"use client";

import { Bell, Search, Settings } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 flex-shrink-0 items-center justify-between gap-x-4 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-2 font-semibold text-lg md:hidden text-white">
        {/* Placeholder for Mobile Title or App Logo */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white text-sm font-bold">DP</span>
        </div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Plan</span>
      </div>

      <div className="flex flex-1 justify-end md:justify-between gap-x-4 lg:gap-x-6">
        <form className="relative flex flex-1 max-w-md hidden md:flex" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search tasks and projects
          </label>
          <div className="relative w-full flex items-center">
            <Search
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-white/40 ml-3"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-10 w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-white placeholder:text-white/40 focus:bg-white/10 focus:ring-1 focus:ring-white/30 focus:border-white/30 sm:text-sm transition-all duration-300 outline-none"
              placeholder="Search tasks..."
              type="search"
              name="search"
            />
          </div>
        </form>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors md:hidden">
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          </button>
          <button type="button" className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <Settings className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
