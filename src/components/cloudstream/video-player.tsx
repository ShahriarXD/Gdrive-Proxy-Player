"use client";

import { AlertTriangleIcon, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type VideoPlayerProps = {
  src: string;
  type: string;
};

export function VideoPlayer({ src, type }: VideoPlayerProps) {
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <video
        className="w-full rounded-[1.25rem] bg-slate-950"
        controls
        playsInline
        preload="metadata"
        onError={(event) => {
          const media = event.currentTarget;
          const code = media.error?.code;
          const reason =
            code === MediaError.MEDIA_ERR_ABORTED
              ? "Playback was aborted."
              : code === MediaError.MEDIA_ERR_NETWORK
                ? "A network error interrupted the stream."
                : code === MediaError.MEDIA_ERR_DECODE
                  ? "The browser could not decode this video. The file codec may be unsupported."
                  : code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
                    ? "The browser could not load this video source."
                    : "This video could not be played.";

          setPlaybackError(reason);
        }}
      >
        <source src={src} type={type} />
        Your browser does not support HTML5 video.
      </video>

      {playbackError ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">Playback issue</p>
            <p className="mt-1 text-amber-100/80">{playbackError}</p>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button asChild variant="outline">
          <a href={src} rel="noreferrer" target="_blank">
            <ExternalLinkIcon className="size-4" />
            Open stream in new tab
          </a>
        </Button>
      </div>
    </div>
  );
}
