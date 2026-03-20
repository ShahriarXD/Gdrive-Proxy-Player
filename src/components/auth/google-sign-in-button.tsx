"use client";

import {
  HardDriveIcon,
  LogInIcon,
  MailIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type GoogleSignInButtonProps = {
  disabled?: boolean;
};

export function GoogleSignInButton({ disabled = false }: GoogleSignInButtonProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startGoogleSignIn = async () => {
    setIsSubmitting(true);
    await signIn("google");
    setIsSubmitting(false);
  };

  return (
    <>
      <Button disabled={disabled} onClick={() => setOpen(true)} size="lg">
        <LogInIcon className="size-4" />
        {disabled ? "Add env vars to enable Google sign-in" : "Continue with Google"}
      </Button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="border-b border-white/10 px-6 py-5">
            <DialogTitle>Connect your Google Drive</DialogTitle>
            <DialogDescription>
              CloudStream will send you to Google next, where you can review and approve access.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 px-6 pb-6">
            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <HardDriveIcon className="mt-0.5 size-5 text-cyan-300" />
                  <div>
                    <p className="font-medium text-white">Read-only Drive access</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">
                      Browse folders and stream video files from your Google Drive.
                      CloudStream does not request file editing or deletion permissions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <MailIcon className="mt-0.5 size-5 text-violet-300" />
                  <div>
                    <p className="font-medium text-white">Basic account info</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">
                      Google shares your email and profile name so the app can identify your session.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="mt-0.5 size-5 text-emerald-300" />
                  <div>
                    <p className="font-medium text-white">You stay in control</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">
                      Google will show its own permission screen after this step, and you can revoke access any time from your Google account permissions page.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button disabled={isSubmitting} onClick={startGoogleSignIn}>
                <LogInIcon className="size-4" />
                {isSubmitting ? "Redirecting to Google..." : "Continue to Google"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
