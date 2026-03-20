"use client";

import type Player from "video.js/dist/types/player";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useEffect, useRef } from "react";

type VideoPlayerProps = {
  src: string;
  type: string;
};

export function VideoPlayer({ src, type }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        fluid: true,
        preload: "auto",
        responsive: true,
      });
    }

    playerRef.current.src({ src, type });

    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, [src, type]);

  return (
    <div data-vjs-player>
      <video className="video-js vjs-big-play-centered" playsInline ref={videoRef} />
    </div>
  );
}
