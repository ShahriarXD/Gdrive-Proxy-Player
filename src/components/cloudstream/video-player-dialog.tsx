"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/cloudstream/video-player";

type VideoPlayerDialogProps = {
  fileId?: string;
  fileName?: string;
  mimeType?: string;
};

export function VideoPlayerDialog({
  fileId,
  fileName,
  mimeType,
}: VideoPlayerDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const open = Boolean(fileId);

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          return;
        }

        const params = new URLSearchParams(searchParams.toString());
        params.delete("videoId");
        router.push(params.toString() ? `/?${params.toString()}` : "/");
      }}
      open={open}
    >
      <DialogContent className="p-0">
        <DialogHeader className="border-b border-white/10 px-6 py-5">
          <DialogTitle>{fileName ?? "Video stream"}</DialogTitle>
          <DialogDescription>
            Streaming through the CloudStream edge proxy with HTTP range support.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          {fileId && mimeType ? (
            <VideoPlayer src={`/api/stream/${fileId}`} type={mimeType} />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
