import { CloudIcon, PlayCircleIcon, ShieldCheckIcon } from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";

type LandingPanelProps = {
  authReady?: boolean;
  errorMessage?: string;
};

export function LandingPanel({
  authReady = true,
  errorMessage,
}: LandingPanelProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-20">
      <div className="glass-panel grid overflow-hidden rounded-[2rem] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col gap-8 px-8 py-10 lg:px-12 lg:py-14">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm text-muted-foreground">
            <CloudIcon className="size-4 text-primary" />
            CloudStream by KM
          </div>

          <div className="flex max-w-2xl flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Browse Google Drive like a polished desktop cloud app and stream instantly.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Sign in with Google, move through folders in a Dropbox-style dashboard,
              and play Drive videos through a range-aware proxy built for Vercel Edge.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <GoogleSignInButton disabled={!authReady} />
            <Button asChild variant="outline" size="lg">
              <a
                href="https://developers.google.com/drive/api/guides/enable-drive-api"
                rel="noreferrer"
                target="_blank"
              >
                Enable Drive API
              </a>
            </Button>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
        </section>

        <section className="flex flex-col justify-between gap-6 border-t border-white/50 bg-slate-950 px-8 py-10 text-white lg:border-l lg:border-t-0">
          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center gap-3">
                <PlayCircleIcon className="size-5 text-cyan-300" />
                <span className="font-medium">Proxy streaming</span>
              </div>
              <p className="text-sm leading-6 text-white/70">
                Range headers are forwarded to Google Drive so scrubbing and seeking
                stay smooth inside the browser player.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheckIcon className="size-5 text-emerald-300" />
                <span className="font-medium">Session-aware API protection</span>
              </div>
              <p className="text-sm leading-6 text-white/70">
                Auth.js protects the proxy route and refreshes Google access tokens
                when they expire so the dashboard stays connected.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm leading-6 text-white/70">
              Before deployment, add `NEXTAUTH_URL`, `NEXTAUTH_SECRET`,
              `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in Vercel, and set the
              Google callback URI to `/api/auth/callback/google`.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
