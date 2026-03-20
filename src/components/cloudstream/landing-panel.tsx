import {
  ArrowRightIcon,
  CloudIcon,
  CommandIcon,
  FilmIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { LandingSearchBar } from "@/components/cloudstream/landing-search-bar";
import { LocalDeskWidget } from "@/components/cloudstream/local-desk-widget";
import { Button } from "@/components/ui/button";
import type { DeskStatus } from "@/lib/desk-status";

type LandingPanelProps = {
  deskStatus: DeskStatus;
};

export function LandingPanel({
  deskStatus,
}: LandingPanelProps) {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-375 items-center px-6 py-10 md:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="home-orb home-orb-primary" />
        <div className="home-orb home-orb-secondary" />
        <div className="home-orb home-orb-tertiary" />
      </div>

      <div className="relative grid w-full gap-8 lg:grid-cols-[1fr_0.95fr]">
        <section className="premium-surface animate-slide-up-fade flex flex-col gap-7 rounded-[2.2rem] p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1e3a8a,#0891b2)] text-white shadow-[0_20px_45px_-26px_rgba(8,145,178,0.5)]">
                <CloudIcon className="size-5" />
              </div>
              <p className="text-lg font-semibold tracking-tight">CloudStream</p>
            </div>
            <div className="glass-pill rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
              Private Drive portal
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-700">
              <SparklesIcon className="size-4 text-cyan-600" />
              CloudStream by KM
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.045em] text-foreground md:text-7xl">
              Your Drive, now clean, cinematic, and fast.
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              Browse folders, search instantly, and stream your own videos without clutter.
            </p>
          </div>

          <LandingSearchBar disabled />

          <div className="flex flex-wrap items-center gap-3">
            <GoogleSignInButton />
            <p className="text-sm text-muted-foreground">
              Sign in with Google and open your full workspace.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="liquid-glass micro-lift rounded-[1.4rem] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Quick jump</p>
              <p className="mt-2 text-sm font-medium">Command+K focused search</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs text-white">
                <CommandIcon className="size-3.5" />
                K
              </div>
            </div>
            <div className="liquid-glass micro-lift rounded-[1.4rem] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Playback</p>
              <p className="mt-2 text-sm font-medium">Fast stream with smooth seek</p>
              <FilmIcon className="mt-4 size-5 text-cyan-600" />
            </div>
            <div className="liquid-glass micro-lift rounded-[1.4rem] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Access</p>
              <p className="mt-2 text-sm font-medium">Read-only Google Drive scope</p>
              <ArrowRightIcon className="mt-4 size-5 text-blue-700" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Link className="glass-pill glass-hover rounded-full px-4 py-2" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="glass-pill glass-hover rounded-full px-4 py-2" href="/terms-of-service">
              Terms of Service
            </Link>
            <Link
              className="glass-pill glass-hover rounded-full px-4 py-2 text-foreground"
              href="https://github.com/ShahriarXD"
              rel="noreferrer"
              target="_blank"
            >
              @ShahriarXD
            </Link>
          </div>
        </section>

        <section className="animate-slide-up-fade relative flex min-h-160 items-center justify-center delay-100">
          <div className="tilt-stage relative w-full max-w-155">
            <div className="orbit-ring orbit-ring-a" />
            <div className="orbit-ring orbit-ring-b" />
            <div className="premium-surface relative rounded-[2.1rem] p-5">
              <div className="liquid-glass mb-4 rounded-3xl p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Workspace preview</p>
                <p className="mt-2 text-lg font-semibold">CloudStream Dashboard</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="liquid-glass rounded-[1.4rem] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Queue</p>
                  <div className="mt-3 space-y-2">
                    {[
                      "Travel_Reel.mp4",
                      "Lecture_Week03.mp4",
                      "Family_Archive.mov",
                    ].map((item) => (
                      <div className="glass-pill rounded-xl px-3 py-2 text-sm" key={item}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="liquid-glass rounded-[1.4rem] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                  <div className="mt-3 space-y-3">
                    <div className="glass-pill rounded-xl px-3 py-2 text-sm">Connected to Google Drive</div>
                    <div className="glass-pill rounded-xl px-3 py-2 text-sm">Range streaming enabled</div>
                    <div className="glass-pill rounded-xl px-3 py-2 text-sm">Search index ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-4 top-4 z-20 w-full max-w-70">
            <LocalDeskWidget initialStatus={deskStatus} />
          </div>
        </section>
      </div>
    </main>
  );
}
