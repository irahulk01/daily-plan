"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Settings, LogOut, Sliders, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

interface TopbarProps {
  user?: {
    name: string | null;
    email: string;
    photoUrl: string | null;
  };
}

export function Topbar({ user }: TopbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "DP";

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setIsMenuOpen(false);
    try {
      await signOut(auth); // sign out of Firebase client
      await fetch("/api/auth/logout", { method: "POST" }); // clear session cookie
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-13 flex-shrink-0 items-center justify-between gap-x-4 px-4 sm:px-6 lg:px-8 bg-[#515055]/35 backdrop-blur-2xl transition-all duration-300">
      {/* Mobile Title Placeholder (Left) */}
      <div className="flex items-center gap-2 font-bold text-sm md:hidden text-white">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Task Planner</span>
      </div>

      {/* Right-aligned Actions */}
      <div className="flex items-center gap-3 ml-auto relative" ref={menuRef}>
        {/* Notifications */}
        <button
          type="button"
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors relative"
          title="Notifications"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Avatar Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-[#D4E556] to-emerald-400 text-[#1C1C1E] font-black text-xs flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ring-2 ring-white/10 focus:outline-none"
          title="Profile & Settings"
        >
          {user?.photoUrl ? (
            <Image src={user.photoUrl} alt={user.name ?? "User"} width={32} height={32} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </button>

        {/* Settings & Profile Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 w-64 rounded-3xl bg-[#3A393E] border border-white/10 p-3 shadow-2xl z-50 overflow-hidden"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#D4E556] to-emerald-400 text-[#1C1C1E] font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                  {user?.photoUrl ? (
                    <Image src={user.photoUrl} alt={user.name ?? "User"} width={40} height={40} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white truncate">{user?.name ?? "User"}</span>
                  <span className="text-[11px] font-medium text-[#A0A0A5] truncate">{user?.email ?? ""}</span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col gap-1 mt-2">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all text-left w-full"
                >
                  <Settings className="w-4 h-4 text-[#D4E556]" />
                  Settings & Preferences
                </button>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all text-left w-full"
                >
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  Account Customization
                </button>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all text-left w-full"
                >
                  <Shield className="w-4 h-4 text-sky-400" />
                  Privacy & Data
                </button>
              </div>

              {/* Footer */}
              <div className="pt-2 mt-2 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all text-left w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
