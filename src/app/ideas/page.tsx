import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { Lightbulb, Plus, Pin, Trash2, Sparkles, FileText, Bookmark } from "lucide-react";
import Link from "next/link";
import { deleteIdea, togglePinIdea } from "@/actions/idea";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
  lime: { bg: "bg-[#3A393E]", border: "border-[#D4E556]/40", text: "text-[#D4E556]", badgeBg: "bg-[#D4E556]/10 text-[#D4E556] border-[#D4E556]/30" },
  emerald: { bg: "bg-[#3A393E]", border: "border-emerald-500/40", text: "text-emerald-400", badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  purple: { bg: "bg-[#3A393E]", border: "border-purple-500/40", text: "text-purple-400", badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  blue: { bg: "bg-[#3A393E]", border: "border-sky-500/40", text: "text-sky-400", badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
  amber: { bg: "bg-[#3A393E]", border: "border-amber-500/40", text: "text-amber-400", badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
};

export default async function IdeasPage() {
  let ideas: any[] = [];
  try {
    const client = (db as any).idea ? db : new PrismaClient();
    ideas = await (client as any).idea.findMany({
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
    });
  } catch (err) {
    console.error("Error loading ideas:", err);
    ideas = [];
  }

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 sm:mt-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Lightbulb className="w-8 h-8 text-[#D4E556]" />
            Ideas & Scratchpad
          </h1>
          <p className="text-xs font-semibold text-[#A0A0A5] mt-1">
            Capture raw thoughts, project plans, and brainstorm notes
          </p>
        </div>

        <Link
          href="?modal=create-idea"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4E556] text-[#1C1C1E] text-xs font-black hover:bg-[#C5D647] transition-all shadow-lg shrink-0 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Idea / Plan
        </Link>
      </div>

      {/* Ideas Grid / Scratchpad Feed */}
      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#3A393E] border border-white/10 rounded-[2.25rem] gap-4 mt-4">
          <div className="w-16 h-16 rounded-full bg-[#D4E556]/10 flex items-center justify-center text-[#D4E556] border border-[#D4E556]/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-white">Your Scratchpad is Empty</h3>
            <p className="text-xs text-[#A0A0A5] max-w-sm">
              Tap the <strong className="text-[#D4E556]">+ New Idea / Plan</strong> button to jot down your next breakthrough thought or plan.
            </p>
          </div>
          <Link
            href="?modal=create-idea"
            className="mt-2 px-6 py-2.5 rounded-2xl bg-[#D4E556] text-[#1C1C1E] text-xs font-black hover:bg-[#C5D647] transition-all shadow-md"
          >
            Create First Idea
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {ideas.map((idea: any) => {
            const style = COLOR_MAP[idea.color || "lime"] || COLOR_MAP.lime;
            return (
              <div
                key={idea.id}
                className={`flex flex-col justify-between p-6 rounded-[2.25rem] ${style.bg} border ${style.border} shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-white/20`}
              >
                {/* Background glow */}
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/5 blur-[50px] rounded-full group-hover:bg-white/10 transition-all" />

                <div className="relative z-10 flex flex-col gap-3">
                  {/* Top bar: Category badge & Pin/Delete actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.badgeBg}`}>
                      {idea.category || "Idea"}
                    </span>

                    <div className="flex items-center gap-1">
                      <form action={async () => { "use server"; await togglePinIdea(idea.id, idea.isPinned); }}>
                        <button
                          type="submit"
                          className={`p-1.5 rounded-xl border transition-all ${
                            idea.isPinned
                              ? "bg-[#D4E556] text-[#1C1C1E] border-[#D4E556]"
                              : "bg-white/5 text-[#A0A0A5] border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                          title={idea.isPinned ? "Unpin idea" : "Pin idea"}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      </form>

                      <form action={async () => { "use server"; await deleteIdea(idea.id); }}>
                        <button
                          type="submit"
                          className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-[#A0A0A5] hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all"
                          title="Delete idea"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug">
                    {idea.title}
                  </h3>

                  {/* Content Scratchpad Body */}
                  {idea.content && (
                    <div className="text-xs font-medium text-[#A0A0A5] whitespace-pre-wrap leading-relaxed bg-[#2D2C30]/60 p-4 rounded-2xl border border-white/5">
                      {idea.content}
                    </div>
                  )}
                </div>

                {/* Footer date */}
                <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[11px] font-semibold text-[#A0A0A5]">
                  <span>{format(new Date(idea.createdAt), "MMM d, yyyy")}</span>
                  {idea.isPinned && (
                    <span className="text-[#D4E556] font-bold flex items-center gap-1">
                      <Bookmark className="w-3 h-3 fill-[#D4E556]" /> Pinned
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
