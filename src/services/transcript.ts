import { YoutubeTranscript } from "youtube-transcript";

export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);

    if (!segments?.length) {
      throw new Error("No captions were found for this video.");
    }

    return segments.map((segment) => segment.text).join(" ");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch the transcript.";
    throw new Error(message);
  }
}
