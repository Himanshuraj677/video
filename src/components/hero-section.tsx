"use client";

import {
  Captions,
  NotebookPen,
  Sparkles,
  Timer,
  Wand2,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/feature-card";
import { YoutubeForm } from "@/components/youtube-form";

type HeroSectionProps = {
  onGenerate: (url: string) => Promise<void>;
  isLoading: boolean;
  errorMessage?: string | null;
  examples: string[];
};

export function HeroSection({
  onGenerate,
  isLoading,
  errorMessage,
  examples,
}: HeroSectionProps) {
  return (
    <section className="hero-surface px-6 pb-16 pt-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-6">
          <Badge variant="accent" className="w-fit">
            Powered by Gemini + YouTube Transcripts
          </Badge>
          <div className="space-y-4">
            <h1 className="text-balance font-[var(--font-display)] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Turn any YouTube lecture into clean, structured notes in seconds.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Paste a lecture link, fetch the transcript, and let Gemini craft
              study-ready notes with summaries, key points, and quick revision
              cues.
            </p>
          </div>
          <div className="glass-card animate-fade-up rounded-3xl p-6 md:p-8">
            <YoutubeForm
              onGenerate={onGenerate}
              isLoading={isLoading}
              examples={examples}
              errorMessage={errorMessage}
            />
          </div>
        </div>
        <div id="features" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Gemini-powered summaries"
            description="Summaries that read like smart lecture recaps, not generic fluff."
          />
          <FeatureCard
            icon={<Captions className="h-5 w-5" />}
            title="Instant transcript parsing"
            description="Pull captions, merge them, and prep them for AI in seconds."
          />
          <FeatureCard
            icon={<NotebookPen className="h-5 w-5" />}
            title="Structured study notes"
            description="Headings, key takeaways, and revision bullets for fast recall."
          />
          <FeatureCard
            icon={<Timer className="h-5 w-5" />}
            title="Fast for long videos"
            description="Optimized flow for lectures, conferences, and tutorial marathons."
          />
          <FeatureCard
            icon={<Wand2 className="h-5 w-5" />}
            title="Editable output"
            description="Copy, download, and refine notes in your favorite editor."
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5" />}
            title="Beginner friendly"
            description="Simple UI with clear errors and guidance built-in."
          />
        </div>
      </div>
    </section>
  );
}
