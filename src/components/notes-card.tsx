"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DownloadCloud, Sparkles } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type NotesCardProps = {
  notes: string | null;
  isLoading: boolean;
  errorMessage?: string | null;
  videoId?: string | null;
};

export function NotesCard({
  notes,
  isLoading,
  errorMessage,
  videoId,
}: NotesCardProps) {
  const handleDownload = () => {
    if (!notes) {
      return;
    }

    const blob = new Blob([notes], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lecture-notes.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Card id="notes" className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Generated Notes
        </CardTitle>
        <CardDescription>
          {videoId ? (
            <span>
              Based on video: {" "}
              <a
                className="font-medium text-foreground underline underline-offset-4"
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noreferrer"
              >
                {videoId}
              </a>
            </span>
          ) : (
            "Your AI-crafted lecture notes will appear here."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : notes ? (
          <div className="max-h-[480px] space-y-4 overflow-y-auto pr-2 text-sm leading-7">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="mt-6 text-base font-semibold text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-4 text-sm font-semibold text-foreground">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
                    {children}
                  </ol>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="text-foreground">{children}</strong>
                ),
              }}
            >
              {notes}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            Paste a YouTube lecture to generate structured notes.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        <CopyButton value={notes ?? ""} disabled={!notes} />
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={!notes}
        >
          <DownloadCloud className="h-4 w-4" />
          Download Markdown
        </Button>
      </CardFooter>
    </Card>
  );
}
