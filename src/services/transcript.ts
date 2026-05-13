import { ProxyAgent, fetch as undiciFetch } from "undici";
import { YoutubeTranscript } from "youtube-transcript";

export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_HOST;
    const rapidApiUrl = process.env.RAPIDAPI_TRANSCRIPT_URL;

    if (rapidApiKey && rapidApiHost && rapidApiUrl) {
      const transcript = await fetchTranscriptFromRapidApi(
        videoId,
        rapidApiUrl,
        rapidApiHost,
        rapidApiKey,
      );
      if (transcript) {
        return transcript;
      }
    }

    const proxyUrl = process.env.TRANSCRIPT_PROXY_URL;
    const proxyAgent = proxyUrl ? new ProxyAgent(proxyUrl) : null;
    const proxyFetch: typeof fetch | undefined = proxyAgent
      ? (input, init) =>
          undiciFetch(input as RequestInfo, {
            ...(init as RequestInit),
            dispatcher: proxyAgent,
          } as RequestInit)
      : undefined;

    const segments = await YoutubeTranscript.fetchTranscript(
      videoId,
      proxyFetch ? { fetch: proxyFetch } : undefined,
    );

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

async function fetchTranscriptFromRapidApi(
  videoId: string,
  urlTemplate: string,
  host: string,
  apiKey: string,
): Promise<string> {
  const url = urlTemplate.includes("{videoId}")
    ? urlTemplate.replace("{videoId}", encodeURIComponent(videoId))
    : urlTemplate;

  const response = await fetch(url, {
    headers: {
      "x-rapidapi-host": host,
      "x-rapidapi-key": apiKey,
    },
  });

  if (!response.ok) {
    return "";
  }

  const data = (await response.json()) as unknown;
  const transcript = extractRapidApiTranscript(data);
  return transcript?.trim() ?? "";
}

function extractRapidApiTranscript(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  if (Array.isArray(payload)) {
    return payload
      .map((item) => (item && typeof item === "object" ? item : null))
      .map((item) => (item as { text?: string } | null)?.text ?? "")
      .join(" ")
      .trim();
  }

  const record = payload as {
    transcript?: Array<{ text?: string }>;
    text?: string;
  };

  if (typeof record.text === "string") {
    return record.text;
  }

  if (Array.isArray(record.transcript)) {
    return record.transcript.map((item) => item.text ?? "").join(" ").trim();
  }

  return "";
}
