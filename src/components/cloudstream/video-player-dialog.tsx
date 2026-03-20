"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/cloudstream/video-player";

type VideoPlayerDialogProps = {
  open: boolean;
  fileId?: string;
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
  onOpenChange: (open: boolean) => void;
};

export function VideoPlayerDialog({
  open,
  fileId,
  fileName,
  fileSize,
  mimeType,
  onOpenChange,
}: VideoPlayerDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 px-6 py-5 backdrop-blur-xl">
          <DialogTitle>{fileName ?? "Video stream"}</DialogTitle>
          <DialogDescription>
            Streaming through the CloudStream edge proxy with HTTP range support.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-6 pb-6">
          {fileId && mimeType ? (
            <VideoPlayer
              fileId={fileId}
              fileName={fileName}
              fileSize={fileSize}
              src={`/api/stream/${fileId}`}
              type={mimeType}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
