"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Pin, Trash2, X, Bookmark, Sparkles, Calendar, Layers } from "lucide-react";
import { format } from "date-fns";
import { deleteIdea, togglePinIdea } from "@/actions/idea";

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badgeBg: string; glow: string }> = {
  lime: { bg: "bg-[#3A393E]", border: "border-[#D4E556]/50", text: "text-[#D4E556]", badgeBg: "bg-[#D4E556]/15 text-[#D4E556] border-[#D4E556]/30", glow: "shadow-[#D4E556]/20" },
  emerald: { bg: "bg-[#3A393E]", border: "border-emerald-500/50", text: "text-emerald-400", badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", glow: "shadow-emerald-500/20" },
  purple: { bg: "bg-[#3A393E]", border: "border-purple-500/50", text: "text-purple-400", badgeBg: "bg-purple-500/15 text-purple-400 border-purple-500/30", glow: "shadow-purple-500/20" },
  blue: { bg: "bg-[#3A393E]", border: "border-sky-500/50", text: "text-sky-400", badgeBg: "bg-sky-500/15 text-sky-400 border-sky-500/30", glow: "shadow-sky-500/20" },
  amber: { bg: "bg-[#3A393E]", border: "border-amber-500/50", text: "text-amber-400", badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30", glow: "shadow-amber-500/20" },
};

interface IdeaStackProps {
  ideas: any[];
}

export function IdeaStack({ ideas }: IdeaStackProps) {
  const [selectedIdea, setSelectedIdea] = useState<any | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleTogglePin = (e: React.MouseEvent, idea: any) => {
    e.stopPropagation();
    startTransition(async () => {
      await togglePinIdea(idea.id, idea.isPinned);
      if (selectedIdea?.id === idea.id) {
        setSelectedIdea((prev: any) => (prev ? { ...prev, isPinned: !prev.isPinned } : null));
      }
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    startTransition(async () => {
      await deleteIdea(id);
      if (selectedIdea?.id === id) {
        setSelectedIdea(null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      {/* Overlapping Vertical Deck Container */}
      <div className="flex flex-col relative pt-2 pb-16">
        {ideas.map((idea, index) => {
          const style = COLOR_MAP[idea.color || "lime"] || COLOR_MAP.lime;
          const isTopCard = activeCardId === idea.id;

          return (
            <motion.div
              key={idea.id}
              layoutId={`card-${idea.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedIdea(idea)}
              onMouseEnter={() => setActiveCardId(idea.id)}
              onMouseLeave={() => setActiveCardId(null)}
              style={{
                zIndex: isTopCard ? 30 : index + 1,
                marginTop: index === 0 ? "0px" : "-6rem",
              }}
              className={`flex flex-col justify-between p-6 rounded-[2.25rem] ${style.bg} border-2 ${style.border} shadow-[0_16px_40px_rgba(0,0,0,0.6)] cursor-pointer relative overflow-hidden group transition-all duration-300 ${
                isTopCard ? "-translate-y-4 scale-[1.02]" : "hover:-translate-y-2 hover:scale-[1.01]"
              }`}
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Background Ambient Glow */}
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/5 blur-[50px] rounded-full group-hover:bg-white/10 transition-all" />

              <div className="relative z-10 flex flex-col gap-3">
                {/* Header Badge & Action Icons */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.badgeBg}`}>
                    {idea.category || "Idea"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleTogglePin(e, idea)}
                      className={`p-1.5 rounded-xl border transition-all ${
                        idea.isPinned
                          ? "bg-[#D4E556] text-[#1C1C1E] border-[#D4E556]"
                          : "bg-white/5 text-[#A0A0A5] border-white/10 hover:text-white hover:bg-white/10"
                      }`}
                      title={idea.isPinned ? "Unpin idea" : "Pin idea"}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, idea.id)}
                      className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-[#A0A0A5] hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all"
                      title="Delete idea"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug group-hover:text-[#D4E556] transition-colors">
                  {idea.title}
                </h3>

                {/* Content Scratchpad Body Preview */}
                {idea.content && (
                  <p className="text-xs font-medium text-[#A0A0A5] line-clamp-2 leading-relaxed bg-[#2D2C30]/70 p-3.5 rounded-2xl border border-white/5">
                    {idea.content}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[11px] font-semibold text-[#A0A0A5]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#A0A0A5]" />
                  {format(new Date(idea.createdAt), "MMM d, yyyy")}
                </span>
                <div className="flex items-center gap-2">
                  {idea.isPinned && (
                    <span className="text-[#D4E556] font-bold flex items-center gap-1">
                      <Bookmark className="w-3 h-3 fill-[#D4E556]" /> Pinned
                    </span>
                  )}
                  <span className="text-[#D4E556] text-[10px] font-extrabold uppercase tracking-wider group-hover:underline flex items-center gap-1">
                    Tap to expand full note →
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Full View Modal Overlay */}
      <AnimatePresence>
        {selectedIdea && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
            <motion.div
              layoutId={`card-${selectedIdea.id}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] bg-[#3A393E] border-2 border-white/20 p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto relative ${
                COLOR_MAP[selectedIdea.color || "lime"]?.glow || ""
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIdea(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all z-20"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-4">
                {/* Header Category & Actions */}
                <div className="flex items-center gap-3">
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                    COLOR_MAP[selectedIdea.color || "lime"]?.badgeBg || ""
                  }`}>
                    {selectedIdea.category || "Idea"}
                  </span>

                  <span className="text-xs font-semibold text-[#A0A0A5]">
                    {format(new Date(selectedIdea.createdAt), "MMMM d, yyyy")}
                  </span>
                </div>

                {/* Full Title */}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug pr-10">
                  {selectedIdea.title}
                </h2>

                {/* Full Description & Scratchpad Notes */}
                {selectedIdea.content ? (
                  <div className="text-sm font-medium text-white/90 whitespace-pre-wrap leading-relaxed bg-[#2D2C30] p-5 rounded-3xl border border-white/10 max-h-[45vh] overflow-y-auto shadow-inner">
                    {selectedIdea.content}
                  </div>
                ) : (
                  <div className="text-xs text-[#A0A0A5] italic py-2">
                    No additional description added to this scratchpad item.
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleTogglePin(e, selectedIdea)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold border transition-all ${
                      selectedIdea.isPinned
                        ? "bg-[#D4E556] text-[#1C1C1E] border-[#D4E556]"
                        : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                    {selectedIdea.isPinned ? "Pinned" : "Pin Item"}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, selectedIdea.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-extrabold transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                <button
                  onClick={() => setSelectedIdea(null)}
                  className="px-5 py-2 rounded-2xl bg-[#D4E556] text-[#1C1C1E] text-xs font-extrabold hover:bg-[#C5D647] transition-all shadow-md"
                >
                  Done Reading
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
