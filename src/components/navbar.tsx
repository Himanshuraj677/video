"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-[var(--font-display)] text-base font-semibold">
              LectureNotes AI
            </span>
            <span className="text-xs text-muted-foreground">YouTube to notes</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a className="hover:text-foreground" href="#features">
              Features
            </a>
            <a className="hover:text-foreground" href="#notes">
              Notes
            </a>
            <a className="hover:text-foreground" href="#faq">
              FAQ
            </a>
          </nav>
          <Button
            variant="outline"
            className="hidden border-border/70 md:inline-flex"
            asChild
          >
            <a href="#notes">Generate</a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
