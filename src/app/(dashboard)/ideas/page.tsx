import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Lightbulb, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { IdeaStack } from "@/components/IdeaStack";
import { Suspense } from "react";
import { IdeasStackSkeleton } from "@/components/skeletons/IdeasSkeleton";

export const dynamic = "force-dynamic";

async function IdeaFeed() {
  let ideas: any[] = [];
  try {
    const session = await getSession();
    ideas = await db.idea.findMany({
      where: session ? { userId: session.id } : {},
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
    });
  } catch (err) {
    console.error("Error loading ideas:", err);
    ideas = [];
  }

  if (ideas.length === 0) {
    return (
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
    );
  }

  return <IdeaStack ideas={ideas} />;
}

export default function IdeasPage() {
  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header Bar - Loads Instantly */}
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

      {/* Ideas Stack Feed - Streams into exact skeleton placeholder */}
      <Suspense fallback={<IdeasStackSkeleton />}>
        <IdeaFeed />
      </Suspense>
    </div>
  );
}
