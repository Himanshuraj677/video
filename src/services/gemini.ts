const NOTES_PROMPT = `Generate clean and well-structured lecture notes from this YouTube lecture transcript.

Return:
1. Short Summary
2. Important Topics
3. Detailed Notes
4. Key Takeaways
5. Quick Revision Points

Make the notes student-friendly and easy to revise.`;

const DEFAULT_MODEL = "openrouter/auto";
const MAX_CHARS_PER_CHUNK = 6000;
const MAX_TOTAL_CHARS = 48000;
const CHUNK_SUMMARY_PROMPT =
  "Summarize this transcript segment into concise bullet points and key concepts. Focus on factual lecture content.";

export async function generateNotes(transcript: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelName = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error("OpenRouter API key is missing.");
  }

  const normalizedTranscript = normalizeTranscript(transcript);
  const clippedTranscript =
    normalizedTranscript.length > MAX_TOTAL_CHARS
      ? `${normalizedTranscript.slice(0, MAX_TOTAL_CHARS)}\n\n[Transcript truncated due to size.]`
      : normalizedTranscript;

  const chunks = splitIntoChunks(clippedTranscript, MAX_CHARS_PER_CHUNK);

  if (chunks.length === 1) {
    return requestCompletion(apiKey, modelName, [
      { role: "system", content: NOTES_PROMPT },
      { role: "user", content: `Transcript:\n${chunks[0]}` },
    ]);
  }

  const chunkSummaries: string[] = [];

  for (const chunk of chunks) {
    const summary = await requestCompletion(apiKey, modelName, [
      { role: "system", content: CHUNK_SUMMARY_PROMPT },
      { role: "user", content: chunk },
    ]);
    chunkSummaries.push(summary);
  }

  return requestCompletion(apiKey, modelName, [
    { role: "system", content: NOTES_PROMPT },
    {
      role: "user",
      content: `Combined segment notes:\n${chunkSummaries.join("\n\n")}`,
    },
  ]);
}

async function requestCompletion(
  apiKey: string,
  model: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  attempt = 0,
): Promise<string> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "LectureNotes AI",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 429 && attempt < 3) {
      const retryDelay = extractRetryDelayMs(errorText) ?? 15000;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return requestCompletion(apiKey, model, messages, attempt + 1);
    }
    throw new Error(
      `OpenRouter API error (${response.status}). ${errorText || "Request failed."}`,
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content ?? "";

  if (!text.trim()) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return text.trim();
}

function extractRetryDelayMs(errorText: string): number | null {
  try {
    const data = JSON.parse(errorText) as {
      error?: { message?: string };
    };
    const message = data.error?.message ?? "";
    const match = message.match(/try again in\s+([\d.]+)s/i);
    if (!match) {
      return null;
    }
    return Math.ceil(Number(match[1]) * 1000);
  } catch {
    return null;
  }
}

function normalizeTranscript(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function splitIntoChunks(text: string, maxChars: number): string[] {
  const sentences =
    text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (current.length + sentence.length + 1 > maxChars && current) {
      chunks.push(current.trim());
      current = sentence;
      continue;
    }

    current = current ? `${current} ${sentence}` : sentence;
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}
