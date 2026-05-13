"use client";

import { useState } from "react";

import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { NotesCard } from "@/components/notes-card";
import type { NotesResponse, TranscriptResponse } from "@/types/notes";

const DEMO_URLS = [
  "https://www.youtube.com/watch?v=hfIUstzHs9A",
  "https://youtu.be/PSRXoC6RL7w",
  "https://www.youtube.com/watch?v=Z5iWr6Srsj8",
];

export default function HomePage() {
  const [notes, setNotes] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleGenerate = async (url: string) => {
    setIsLoading(true);
    setNotes(null);
    setVideoId(null);
    setErrorMessage(null);

    try {
      const transcriptResponse = await fetch("/api/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!transcriptResponse.ok) {
        const errorData = (await transcriptResponse.json()) as { error?: string };
        throw new Error(errorData.error ?? "Unable to fetch transcript.");
      }

      const transcriptData =
        (await transcriptResponse.json()) as TranscriptResponse;
      setVideoId(transcriptData.videoId);

      const notesResponse = await fetch("/api/generate-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript: transcriptData.transcript }),
      });

      if (!notesResponse.ok) {
        const errorData = (await notesResponse.json()) as { error?: string };
        throw new Error(errorData.error ?? "Unable to generate notes.");
      }

      const notesData = (await notesResponse.json()) as NotesResponse;
      setNotes(notesData.notes);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection
        onGenerate={handleGenerate}
        isLoading={isLoading}
        errorMessage={errorMessage}
        examples={DEMO_URLS}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-16">
        <NotesCard
          notes={notes}
          isLoading={isLoading}
          errorMessage={errorMessage}
          videoId={videoId}
        />
        <section className="grid gap-4 md:grid-cols-3">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-[var(--font-display)] text-lg font-semibold">
              Step 1
            </h3>
            <p className="text-sm text-muted-foreground">
              Paste a YouTube lecture URL and validate it instantly.
            </p>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-[var(--font-display)] text-lg font-semibold">
              Step 2
            </h3>
            <p className="text-sm text-muted-foreground">
              We fetch the transcript and send it to Gemini AI for structure.
            </p>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-[var(--font-display)] text-lg font-semibold">
              Step 3
            </h3>
            <p className="text-sm text-muted-foreground">
              Copy, download, and revise your notes instantly.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
