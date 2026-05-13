import { NextResponse } from "next/server";

import { youtubeRequestSchema } from "@/lib/validation";
import { fetchTranscript } from "@/services/transcript";
import { extractYouTubeId } from "@/utils/youtube";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = youtubeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const videoId = extractYouTubeId(parsed.data.url);

  if (!videoId) {
    return NextResponse.json(
      { error: "Enter a valid YouTube URL." },
      { status: 400 },
    );
  }

  try {
    const transcript = await fetchTranscript(videoId);
    return NextResponse.json({ transcript, videoId });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch the transcript.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
