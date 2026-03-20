"use client";

import {
  AlertTriangleIcon,
  ClapperboardIcon,
  ExternalLinkIcon,
  InfoIcon,
  MaximizeIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
  VolumeOffIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";

type VideoPlayerProps = {
  fileId: string;
  fileName?: string;
  fileSize?: string;
  src: string;
  type: string;
};

type PreviewState = {
  time: number;
  x: number;
};

type GestureMode = "volume" | "brightness";
type InteractionHudState = "play" | "pause" | "+10s" | "-10s";

const RESUME_MINIMUM_SECONDS = 8;
const SEEK_SECONDS = 10;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatPlaybackTime(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(value);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getResolutionLabel(width: number, height: number) {
  const maxDimension = Math.max(width, height);

  if (maxDimension >= 3840) {
    return "4K";
  }

  if (maxDimension >= 2560) {
    return "1440p";
  }

  if (maxDimension >= 1920) {
    return "1080p";
  }

  if (maxDimension >= 1280) {
    return "720p";
  }

  return "SD";
}

export function VideoPlayer({
  fileId,
  fileName,
  fileSize,
  src,
  type,
}: VideoPlayerProps) {
  const playerShellRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const ambientCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverFrameRef = useRef<number | null>(null);
  const dragActiveRef = useRef(false);
  const gestureStateRef = useRef<{
    active: boolean;
    mode: GestureMode;
    pointerId: number;
    startY: number;
    startValue: number;
    moved: boolean;
  } | null>(null);
  const lastTapRef = useRef<{ side: "left" | "right"; time: number } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const interactionHudTimeoutRef = useRef<number | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [resumeTime, setResumeTime] = useState<number | null>(null);
  const [theaterMode, setTheaterMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [showNowPlaying, setShowNowPlaying] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [ambientFrame, setAmbientFrame] = useState<string | null>(null);
  const [gestureHud, setGestureHud] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [resolution, setResolution] = useState<{ width: number; height: number } | null>(null);
  const [interactionHud, setInteractionHud] = useState<InteractionHudState | null>(null);

  const storageKey = useMemo(() => `cloudstream:resume:${fileId}`, [fileId]);
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const resolutionLabel = resolution
    ? `${getResolutionLabel(resolution.width, resolution.height)} (${resolution.width}x${resolution.height})`
    : "Detecting";

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

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }

      if (interactionHudTimeoutRef.current) {
        window.clearTimeout(interactionHudTimeoutRef.current);
      }

      if (hoverFrameRef.current) {
        window.cancelAnimationFrame(hoverFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !videoRef.current) {
      return;
    }

    const captureFrame = () => {
      const video = videoRef.current;

      if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
        return;
      }

      const canvas = ambientCanvasRef.current ?? document.createElement("canvas");
      ambientCanvasRef.current = canvas;
      canvas.width = 96;
      canvas.height = 54;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setAmbientFrame(canvas.toDataURL("image/jpeg", 0.3));
    };

    captureFrame();
    const interval = window.setInterval(captureFrame, 4000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPlaying]);

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

  const runNowPlayingToast = () => {
    setShowNowPlaying(true);

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setShowNowPlaying(false);
    }, 3000);
  };

  const seekTo = useCallback((nextTime: number) => {
    if (!videoRef.current || !Number.isFinite(duration) || duration <= 0) {
      return;
    }

    const clampedTime = clamp(nextTime, 0, duration);
    videoRef.current.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  }, [duration]);

  const seekBy = useCallback((amount: number) => {
    if (!videoRef.current) {
      return;
    }

    seekTo(videoRef.current.currentTime + amount);

    if (amount > 0) {
      setInteractionHud("+10s");
    } else {
      setInteractionHud("-10s");
    }
  }, [seekTo]);

  const resumePlayback = () => {
    const media = videoRef.current;

    if (!media || resumeTime === null) {
      return;
    }

    media.currentTime = resumeTime;
    void media.play().catch(() => undefined);
    setResumeTime(null);
  };

  const startFromBeginning = () => {
    window.localStorage.removeItem(storageKey);
    setResumeTime(null);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) {
      return;
    }

    if (videoRef.current.paused) {
      setInteractionHud("play");
      void videoRef.current.play().catch(() => undefined);
      return;
    }

    setInteractionHud("pause");
    videoRef.current.pause();
  };

  const toggleMute = () => {
    if (!videoRef.current) {
      return;
    }

    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setVolume(nextMuted ? 0 : videoRef.current.volume || 1);
  };

  const setVolumeLevel = (nextVolume: number) => {
    if (!videoRef.current) {
      return;
    }

    const clampedVolume = clamp(nextVolume, 0, 1);
    videoRef.current.volume = clampedVolume;
    videoRef.current.muted = clampedVolume === 0;
    setVolume(clampedVolume);
  };

  const toggleFullscreen = async () => {
    const media = videoRef.current;
    const playerShell = playerShellRef.current;
    const fullscreenTarget = media ?? playerShell;

    if (!fullscreenTarget) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if ("requestFullscreen" in fullscreenTarget) {
      await fullscreenTarget.requestFullscreen().catch(() => undefined);
      return;
    }

    if (media && "webkitEnterFullscreen" in media) {
      (media as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    }
  };

  const updatePreviewFromClientX = (clientX: number) => {
    if (hoverFrameRef.current !== null) {
      window.cancelAnimationFrame(hoverFrameRef.current);
    }

    hoverFrameRef.current = window.requestAnimationFrame(() => {
      hoverFrameRef.current = null;

      if (!timelineRef.current || duration <= 0) {
        setPreview(null);
        return;
      }

      const bounds = timelineRef.current.getBoundingClientRect();
      const relativeX = clamp(clientX - bounds.left, 0, bounds.width);
      const ratio = bounds.width ? relativeX / bounds.width : 0;
      const nextTime = ratio * duration;

      setPreview({
        time: nextTime,
        x: relativeX,
      });
    });
  };

  const seekFromClientX = useCallback((clientX: number) => {
    if (!timelineRef.current || duration <= 0) {
      return;
    }

    const bounds = timelineRef.current.getBoundingClientRect();
    const relativeX = clamp(clientX - bounds.left, 0, bounds.width);
    const ratio = bounds.width ? relativeX / bounds.width : 0;
    seekTo(ratio * duration);
    setPreview({
      time: ratio * duration,
      x: relativeX,
    });
  }, [duration, seekTo]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (dragActiveRef.current) {
        seekFromClientX(event.clientX);
      }

      const gestureState = gestureStateRef.current;

      if (!gestureState || !videoRef.current || event.pointerId !== gestureState.pointerId) {
        return;
      }

      const deltaY = gestureState.startY - event.clientY;

      if (Math.abs(deltaY) > 8) {
        gestureState.moved = true;
      }

      if (gestureState.mode === "volume") {
        const nextVolume = clamp(gestureState.startValue + deltaY / 240, 0, 1);
        videoRef.current.volume = nextVolume;
        videoRef.current.muted = nextVolume === 0;
        setVolume(nextVolume);
        setGestureHud(`Volume ${Math.round(nextVolume * 100)}%`);
      } else {
        const nextBrightness = clamp(gestureState.startValue + deltaY / 260, 0.55, 1.45);
        setBrightness(nextBrightness);
        setGestureHud(`Brightness ${Math.round(nextBrightness * 100)}%`);
      }
    };

    const handlePointerUp = () => {
      dragActiveRef.current = false;

      if (gestureStateRef.current) {
        window.setTimeout(() => setGestureHud(null), 700);
      }

      gestureStateRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [seekFromClientX]);

  const beginTouchGesture = (mode: GestureMode, event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") {
      return;
    }

    const currentValue = mode === "volume" ? volume : brightness;

    gestureStateRef.current = {
      active: true,
      mode,
      pointerId: event.pointerId,
      startY: event.clientY,
      startValue: currentValue,
      moved: false,
    };
  };

  const handleTapSeek = (side: "left" | "right", pointerType: string) => {
    if (pointerType !== "touch") {
      return;
    }

    const now = Date.now();
    const previous = lastTapRef.current;

    if (previous && previous.side === side && now - previous.time < 280) {
      seekBy(side === "left" ? -SEEK_SECONDS : SEEK_SECONDS);
      lastTapRef.current = null;
      return;
    }

    lastTapRef.current = { side, time: now };
  };

  const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const media = event.currentTarget;
    setDuration(media.duration || 0);
    setResolution({ width: media.videoWidth, height: media.videoHeight });
    setVolume(media.volume);
  };

  useEffect(() => {
    if (!interactionHud) {
      return;
    }

    if (interactionHudTimeoutRef.current) {
      window.clearTimeout(interactionHudTimeoutRef.current);
    }

    interactionHudTimeoutRef.current = window.setTimeout(() => {
      setInteractionHud(null);
    }, 480);

    return () => {
      if (interactionHudTimeoutRef.current) {
        window.clearTimeout(interactionHudTimeoutRef.current);
      }
    };
  }, [interactionHud]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null;
      const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.tagName === "SELECT" ||
        activeElement?.isContentEditable;

      if (isTyping) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "j") {
        event.preventDefault();
        seekBy(-SEEK_SECONDS);
        return;
      }

      if (key === "l") {
        event.preventDefault();
        seekBy(SEEK_SECONDS);
        return;
      }

      if (key === "k" || key === " ") {
        event.preventDefault();
        togglePlay();
        return;
      }

      if (key === "f") {
        event.preventDefault();
        void toggleFullscreen();
        return;
      }

      if (key === "m") {
        event.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [seekBy]);

  return (
    <div className="animate-in fade-in-0 zoom-in-95 space-y-4 duration-300">
      <div className="glass-panel rounded-[1.6rem] px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {fileName ?? "Video stream"}
            </p>
            <p className="mt-1 text-sm text-white/60">
              Native streaming with seek support
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowInfo((currentValue) => !currentValue)}
              variant="outline"
            >
              <InfoIcon className="size-4" />
              File specs
            </Button>
            <Button
              onClick={() => setTheaterMode((currentValue) => !currentValue)}
              variant={theaterMode ? "default" : "outline"}
            >
              <ClapperboardIcon className="size-4" />
              {theaterMode ? "Exit theater" : "Theater mode"}
            </Button>
            <Button asChild variant="outline">
              <a href={src} rel="noreferrer" target="_blank">
                <ExternalLinkIcon className="size-4" />
                Open stream
              </a>
            </Button>
          </div>
        </div>

        {showInfo ? (
          <div className="mt-4 grid gap-3 rounded-[1.4rem] border border-white/12 bg-white/6 p-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Resolution</p>
              <p className="mt-2 text-sm font-medium text-white">{resolutionLabel}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">File size</p>
              <p className="mt-2 text-sm font-medium text-white">{formatBytes(fileSize)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">MIME type</p>
              <p className="mt-2 truncate text-sm font-medium text-white">{type}</p>
            </div>
          </div>
        ) : null}
      </div>

      {resumeTime !== null ? (
        <div className="glass-panel flex flex-col gap-3 rounded-[1.4rem] px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-white">Resume playback?</p>
            <p className="mt-1 text-sm text-white/65">
              Pick up {formatPlaybackTime(resumeTime)} into this video.
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

      <div
        ref={playerShellRef}
        className="video-player-shell relative overflow-hidden rounded-[1.8rem] border border-white/12 bg-[#080c17] shadow-[0_32px_90px_-40px_rgba(3,7,18,0.85)] transition-[border-radius,transform,box-shadow] duration-300 ease-out"
      >
        {ambientFrame ? (
          <div
            className="pointer-events-none absolute inset-0 scale-110 opacity-60 blur-3xl"
            style={{
              backgroundImage: `url(${ambientFrame})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_25%),linear-gradient(180deg,rgba(8,12,23,0.1),rgba(8,12,23,0.74))]" />

        <div className="relative">
          {showNowPlaying ? (
            <div className="pointer-events-none absolute left-5 top-5 z-30 max-w-md rounded-[1.2rem] border border-white/12 bg-black/26 px-4 py-3 text-white shadow-lg backdrop-blur-md transition duration-500">
              <p className="truncate text-sm font-semibold">{fileName ?? "Video stream"}</p>
              <p className="mt-1 text-sm text-white/68">Native streaming with seek support</p>
            </div>
          ) : null}

          {gestureHud ? (
            <div className="pointer-events-none absolute left-1/2 top-5 z-30 -translate-x-1/2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              {gestureHud}
            </div>
          ) : null}

          {interactionHud ? (
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 animate-in fade-in-0 zoom-in-75 duration-200">
              <div className="rounded-full border border-white/12 bg-black/34 p-5 text-white shadow-2xl backdrop-blur-xl">
                {interactionHud === "play" ? (
                  <PlayIcon className="size-7" />
                ) : interactionHud === "pause" ? (
                  <PauseIcon className="size-7" />
                ) : (
                  <div className="min-w-14 text-center text-lg font-semibold tracking-tight">
                    {interactionHud}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <div className="group relative">
            <video
              ref={videoRef}
              className="block h-auto max-h-[72vh] w-full rounded-[1.6rem] object-contain"
              playsInline
              preload="metadata"
              style={{ filter: `brightness(${brightness})` }}
              onClick={togglePlay}
              onDoubleClick={() => void toggleFullscreen()}
              onEnded={() => {
                window.localStorage.removeItem(storageKey);
                setResumeTime(null);
                setIsPlaying(false);
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
              onLoadedMetadata={handleLoadedMetadata}
              onPause={() => {
                setIsPlaying(false);
                persistPlayback();
              }}
              onPlay={() => {
                setIsPlaying(true);
                runNowPlayingToast();
              }}
              onTimeUpdate={(event) => {
                setCurrentTime(event.currentTarget.currentTime);
                setVolume(event.currentTarget.muted ? 0 : event.currentTarget.volume);

                if (Math.floor(event.currentTarget.currentTime) % 5 === 0) {
                  persistPlayback();
                }
              }}
            >
              <source src={src} type={type} />
              Your browser does not support HTML5 video.
            </video>

            <div className="absolute inset-y-0 left-0 z-20 w-[26%]">
              <div
                className="h-full w-full"
                onDoubleClick={() => seekBy(-SEEK_SECONDS)}
                onPointerDown={(event) => beginTouchGesture("volume", event)}
                onPointerUp={(event) => handleTapSeek("left", event.pointerType)}
              />
            </div>
            <div className="absolute inset-y-0 right-0 z-20 w-[26%]">
              <div
                className="h-full w-full"
                onDoubleClick={() => seekBy(SEEK_SECONDS)}
                onPointerDown={(event) => beginTouchGesture("brightness", event)}
                onPointerUp={(event) => handleTapSeek("right", event.pointerType)}
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.72))] px-4 pb-4 pt-16">
              <div
                ref={timelineRef}
                className="pointer-events-auto relative mb-4 cursor-pointer py-3"
                onMouseLeave={() => setPreview(null)}
                onMouseMove={(event) => updatePreviewFromClientX(event.clientX)}
                onPointerDown={(event) => {
                  dragActiveRef.current = true;
                  seekFromClientX(event.clientX);
                }}
              >
                {preview ? (
                  <div
                    className="pointer-events-none absolute bottom-full z-20 mb-3 -translate-x-1/2"
                    style={{ left: preview.x }}
                  >
                    <div className="rounded-full border border-white/16 bg-black/72 px-3 py-2 text-xs font-medium text-white shadow-2xl backdrop-blur-md">
                      {formatPlaybackTime(preview.time)}
                    </div>
                  </div>
                ) : null}

                <div className="h-2 rounded-full bg-white/18 transition-all duration-200 group-hover:h-3">
                  <div
                    className="relative h-full rounded-full bg-[linear-gradient(90deg,#7f8cff_0%,#74d8ff_100%)] shadow-[0_0_24px_rgba(116,216,255,0.35)]"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute right-0 top-1/2 size-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.5)] group-hover:size-4" />
                  </div>
                </div>
              </div>

              <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    className="liquid-glass flex size-11 items-center justify-center rounded-full text-white"
                    onClick={togglePlay}
                    type="button"
                  >
                    {isPlaying ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
                  </button>
                  <button
                    className="liquid-glass hidden size-11 items-center justify-center rounded-full text-white md:flex"
                    onClick={() => seekBy(-SEEK_SECONDS)}
                    type="button"
                  >
                    <SkipBackIcon className="size-5" />
                  </button>
                  <button
                    className="liquid-glass hidden size-11 items-center justify-center rounded-full text-white md:flex"
                    onClick={() => seekBy(SEEK_SECONDS)}
                    type="button"
                  >
                    <SkipForwardIcon className="size-5" />
                  </button>
                  <button
                    className="liquid-glass flex size-11 items-center justify-center rounded-full text-white"
                    onClick={toggleMute}
                    type="button"
                  >
                    {volume === 0 ? <VolumeOffIcon className="size-5" /> : <Volume2Icon className="size-5" />}
                  </button>
                  <input
                    aria-label="Volume"
                    className="accent-white hidden h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-white/20 md:block"
                    max="1"
                    min="0"
                    onChange={(event) => setVolumeLevel(Number(event.target.value))}
                    step="0.01"
                    type="range"
                    value={volume}
                  />
                  <div className="hidden min-w-28 text-sm text-white/80 md:block">
                    {formatPlaybackTime(currentTime)} / {formatPlaybackTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden rounded-full border border-white/12 bg-black/18 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/65 md:block">
                    {resolution ? getResolutionLabel(resolution.width, resolution.height) : "Streaming"}
                  </div>
                  <button
                    className="liquid-glass flex size-11 items-center justify-center rounded-full text-white"
                    onClick={toggleFullscreen}
                    type="button"
                  >
                    <MaximizeIcon className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {playbackError ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">Playback issue</p>
            <p className="mt-1 text-amber-100/80">{playbackError}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
