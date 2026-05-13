const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace("www.", "");

    if (hostname === "youtu.be") {
      const id = parsed.pathname.split("/")[1];
      return isValidYouTubeId(id) ? id : null;
    }

    if (hostname.endsWith("youtube.com")) {
      const paramId = parsed.searchParams.get("v");
      if (isValidYouTubeId(paramId)) {
        return paramId;
      }

      const pathParts = parsed.pathname.split("/").filter(Boolean);
      const pathId = pathParts[1];
      if (["embed", "v", "shorts"].includes(pathParts[0] ?? "")) {
        return isValidYouTubeId(pathId) ? pathId : null;
      }
    }
  } catch {
    // Fallback to regex matching.
  }

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );

  return match ? match[1] : null;
}

function isValidYouTubeId(id?: string | null): id is string {
  return Boolean(id && YOUTUBE_ID_PATTERN.test(id));
}
