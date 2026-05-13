"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type YoutubeRequest,
  youtubeRequestSchema,
} from "@/lib/validation";

type YoutubeFormProps = {
  onGenerate: (url: string) => Promise<void>;
  isLoading: boolean;
  examples: string[];
  errorMessage?: string | null;
};

export function YoutubeForm({
  onGenerate,
  isLoading,
  examples,
  errorMessage,
}: YoutubeFormProps) {
  const form = useForm<YoutubeRequest>({
    resolver: zodResolver(youtubeRequestSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (values: YoutubeRequest) => {
    await onGenerate(values.url);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 md:flex-row"
      >
        <div className="flex-1">
          <Input
            {...form.register("url")}
            placeholder="Paste a YouTube lecture URL"
            aria-label="YouTube video URL"
          />
          {form.formState.errors.url?.message ? (
            <p className="mt-2 text-sm text-rose-500">
              {form.formState.errors.url.message}
            </p>
          ) : null}
        </div>
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate Notes
            </>
          )}
        </Button>
      </form>
      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Demo URLs
        </span>
        {examples.map((example) => (
          <Button
            key={example}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-border/70 text-xs"
            onClick={() => {
              form.setValue("url", example, { shouldValidate: true });
            }}
          >
            {example}
          </Button>
        ))}
      </div>
    </div>
  );
}
