"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Lightbulb, X, Sparkles, Pin } from "lucide-react";
import { createIdea } from "@/actions/idea";

const COLOR_OPTIONS = [
  { id: "lime", name: "Lime", bg: "bg-[#D4E556]", border: "border-[#D4E556]/50", text: "text-[#D4E556]" },
  { id: "emerald", name: "Emerald", bg: "bg-emerald-400", border: "border-emerald-500/50", text: "text-emerald-400" },
  { id: "purple", name: "Purple", bg: "bg-purple-400", border: "border-purple-500/50", text: "text-purple-400" },
  { id: "blue", name: "Blue", bg: "bg-sky-400", border: "border-sky-500/50", text: "text-sky-400" },
  { id: "amber", name: "Amber", bg: "bg-amber-400", border: "border-amber-500/50", text: "text-amber-400" },
];

export function CreateIdeaModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOpen = searchParams.get("modal") === "create-idea";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Idea");
  const [color, setColor] = useState("lime");
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      const res = await createIdea({
        title,
        content,
        category,
        color,
      });

      if (res.success) {
        setTitle("");
        setContent("");
        router.back();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#3A393E] border border-white/10 rounded-[2.25rem] shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Header Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4E556]/15 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D4E556]/10 border border-[#D4E556]/30 flex items-center justify-center text-[#D4E556]">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">New Idea & Plan</h2>
              <p className="text-xs text-[#A0A0A5]">Scratchpad for raw thoughts and plans</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#A0A0A5] hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#2D2C30] rounded-2xl border border-white/5">
            {["Idea", "Plan", "Scratchpad"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  category === cat
                    ? "bg-[#D4E556] text-[#1C1C1E] shadow-sm"
                    : "text-[#A0A0A5] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#A0A0A5] mb-1.5">
              Title / Thought Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Redesign Dashboard Layout..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#2D2C30] border border-white/10 rounded-2xl text-white placeholder-[#A0A0A5]/60 text-sm font-semibold focus:outline-none focus:border-[#D4E556] transition-all"
            />
          </div>

          {/* Content Scratchpad Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#A0A0A5] mb-1.5">
              Notes & Details (Scratchpad)
            </label>
            <textarea
              rows={4}
              placeholder="Jot down details, steps, bullet points, or thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-[#2D2C30] border border-white/10 rounded-2xl text-white placeholder-[#A0A0A5]/60 text-sm font-medium focus:outline-none focus:border-[#D4E556] transition-all resize-none"
            />
          </div>

          {/* Color Accent Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#A0A0A5] mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-8 h-8 rounded-full ${c.bg} transition-all flex items-center justify-center ${
                    color === c.id ? "ring-4 ring-white/30 scale-110" : "opacity-75 hover:opacity-100"
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-2xl border border-white/10 text-xs font-bold text-[#A0A0A5] hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="px-6 py-2.5 rounded-2xl bg-[#D4E556] text-[#1C1C1E] text-xs font-black hover:bg-[#C5D647] active:scale-95 transition-all shadow-md disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              {isPending ? "Saving..." : "Save Idea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
