"use client";

export function Footer() {
  return (
    <footer id="faq" className="border-t border-border/60 px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-foreground">LectureNotes AI</p>
          <p>Build smarter notes from any lecture in seconds.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <span>Privacy-first: we do not store transcripts.</span>
          <span>Made for learners.</span>
        </div>
      </div>
    </footer>
  );
}
