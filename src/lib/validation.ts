import { z } from "zod";

import { extractYouTubeId } from "@/utils/youtube";

export const youtubeUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .refine((value) => Boolean(extractYouTubeId(value)), {
    message: "Enter a valid YouTube URL.",
  });

export const youtubeRequestSchema = z.object({
  url: youtubeUrlSchema,
});

export const transcriptRequestSchema = z.object({
  transcript: z
    .string()
    .trim()
    .min(40, "Transcript is too short to summarize."),
});

export type YoutubeRequest = z.infer<typeof youtubeRequestSchema>;
export type TranscriptRequest = z.infer<typeof transcriptRequestSchema>;
