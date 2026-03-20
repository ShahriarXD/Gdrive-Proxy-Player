"use client";

import { AlertTriangleIcon, ClapperboardIcon, ExternalLinkIcon, PlayIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type VideoPlayerProps = {
  fileId: string;
  fileName?: string;
  src: string;
  type: string;
};

const RESUME_MINIMUM_SECONDS = 8;

export function VideoPlayer({ fileId, fileName, src, type }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [resumeTime, setResumeTime] = useState<number | null>(null);
  const [theaterMode, setTheaterMode] = useState(false);

  const storageKey = useMemo(() => `cloudstream:resume:${fileId}`, [fileId]);

  useEffect(() => {
    const rawValue = window.localStorage.getItem(storageKey);
    const parsedValue = rawValue ? Number(rawValue) : NaN;

    if (Number.isFinite(parsedValue) && parsedValue >= RESUME_MINIMUM_SECONDS) {
      setResumeTime(parsedValue);
    } else {
      setResumeTime(null);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = document.documentElement;

    if (theaterMode) {
      root.dataset.theaterMode = "true";
    } else {
      delete root.dataset.theaterMode;
    }

    return () => {
      delete root.dataset.theaterMode;
    };
  }, [theaterMode]);

  const persistPlayback = () => {
    const media = videoRef.current;

    if (!media || !Number.isFinite(media.currentTime)) {
      return;
    }

    const remainingTime = Number.isFinite(media.duration)
      ? media.duration - media.currentTime
      : Number.POSITIVE_INFINITY;

    if (
      media.currentTime >= RESUME_MINIMUM_SECONDS &&
      remainingTime > RESUME_MINIMUM_SECONDS
    ) {
      window.localStorage.setItem(storageKey, String(media.currentTime));
      setResumeTime(media.currentTime);
      return;
    }

    window.localStorage.removeItem(storageKey);
    setResumeTime(null);
  };

  const resumePlayback = () => {
    const media = videoRef.current;

    if (!media || resumeTime === null) {
      return;
    }

    media.currentTime = resumeTime;
    void media.play().catch(() => {
      return;
    });
    setResumeTime(null);
  };

  const startFromBeginning = () => {
    window.localStorage.removeItem(storageKey);
    setResumeTime(null);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">
            {fileName ?? "Video stream"}
          </p>
          <p className="text-sm text-white/60">
            Native streaming with seek support
          </p>
        </div>
        <Button
          onClick={() => setTheaterMode((currentValue) => !currentValue)}
          variant={theaterMode ? "default" : "outline"}
        >
          <ClapperboardIcon className="size-4" />
          {theaterMode ? "Exit theater" : "Theater mode"}
        </Button>
      </div>

      {resumeTime !== null ? (
        <div className="flex flex-col gap-3 rounded-[1.4rem] border border-white/12 bg-white/6 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-white">Resume playback?</p>
            <p className="mt-1 text-sm text-white/65">
              Pick up {Math.floor(resumeTime)} seconds into this video.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={resumePlayback} size="sm">
              <PlayIcon className="size-4" />
              Resume
            </Button>
            <Button onClick={startFromBeginning} size="sm" variant="outline">
              Start over
            </Button>
          </div>
        </div>
      ) : null}

      <video
        ref={videoRef}
        className="w-full rounded-[1.25rem] bg-slate-950"
        controls
        playsInline
        preload="metadata"
        onEnded={() => {
          window.localStorage.removeItem(storageKey);
          setResumeTime(null);
        }}
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
        onPause={persistPlayback}
        onTimeUpdate={(event) => {
          if (Math.floor(event.currentTarget.currentTime) % 5 === 0) {
            persistPlayback();
          }
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
