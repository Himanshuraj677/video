import { NextResponse } from "next/server";

import { transcriptRequestSchema } from "@/lib/validation";
import { generateNotes } from "@/services/gemini";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = transcriptRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  try {
    const notes = await generateNotes(parsed.data.transcript);
    return NextResponse.json({ notes });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to generate notes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
