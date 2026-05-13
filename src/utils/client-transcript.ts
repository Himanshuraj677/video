export async function fetchTranscriptFromClient(
  videoId: string,
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Client transcript fetch requires a browser context.");
  }

  const urls = [
    `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`,
    `https://www.youtube.com/api/timedtext?v=${videoId}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        continue;
      }

      const xml = await response.text();
      const transcript = parseTranscriptXml(xml);
      if (transcript) {
        return transcript;
      }
    } catch {
      // Ignore and try the next endpoint.
    }
  }

  throw new Error(
    "Client transcript fetch failed. Captions may be disabled or blocked by CORS.",
  );
}

function parseTranscriptXml(xml: string): string | null {
  if (!xml.includes("<text")) {
    return null;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  if (doc.getElementsByTagName("parsererror").length > 0) {
    return null;
  }

  const nodes = Array.from(doc.getElementsByTagName("text"));
  if (!nodes.length) {
    return null;
  }

  const combined = nodes
    .map((node) => node.textContent ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return combined.length > 0 ? combined : null;
}
