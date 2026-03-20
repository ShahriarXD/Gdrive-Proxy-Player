import {
  CloudIcon,
  FolderIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
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
  errorMessage?: string;
};

export function LandingPanel({
  deskStatus,
  errorMessage,
}: LandingPanelProps) {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-6 py-10 md:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-20 size-36 rounded-full bg-blue-400/12 blur-3xl" />
        <div className="absolute right-[10%] top-[18%] size-48 rounded-full bg-cyan-300/14 blur-3xl" />
        <div className="absolute bottom-16 left-[34%] size-56 rounded-full bg-violet-300/12 blur-3xl" />
      </div>

      <div className="relative grid w-full gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="premium-surface animate-slide-up-fade flex flex-col justify-between gap-8 rounded-[2.25rem] p-8 lg:p-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(88,105,255,1),rgba(80,195,255,0.9))] text-white shadow-[0_18px_50px_-24px_rgba(71,101,255,0.7)]">
                <CloudIcon className="size-5" />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight">CloudStream</p>
                <p className="text-sm text-muted-foreground">Premium Drive streaming workspace</p>
              </div>
            </div>
            <div className="rounded-full border border-white/80 bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Private drive portal
            </div>
          </div>

          <div className="max-w-2xl space-y-5">
            <div className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-800 shadow-lg">
              <SparklesIcon className="size-4 text-cyan-300" />
              Premium cloud workspace
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-foreground md:text-7xl">
              Continue with Google and open your private streaming desk.
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              Browse your Drive like a premium media library, search with desktop-style
              precision, and stream instantly through a Vercel-friendly proxy.
            </p>
          </div>

          <LandingSearchBar disabled />

          <div className="flex flex-wrap items-center gap-3">
            <GoogleSignInButton />
            <p className="text-sm text-muted-foreground">
              One tap gets you into CloudStream with official Google sign-in.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="liquid-glass micro-lift hover-sheen rounded-[1.5rem] p-4">
              <FolderIcon className="mb-4 size-5 text-primary" />
              <p className="text-sm font-medium text-foreground">Folder-first navigation</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Browse Drive like a refined file system, not a raw API response.
              </p>
            </div>
            <div className="liquid-glass micro-lift hover-sheen rounded-[1.5rem] p-4">
              <PlayCircleIcon className="mb-4 size-5 text-cyan-500" />
              <p className="text-sm font-medium text-foreground">Instant video streaming</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Range-aware playback gives fast scrubbing and lightweight delivery.
              </p>
            </div>
            <div className="liquid-glass micro-lift hover-sheen rounded-[1.5rem] p-4">
              <ShieldCheckIcon className="mb-4 size-5 text-emerald-500" />
              <p className="text-sm font-medium text-foreground">Session-safe access</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Auth.js refreshes tokens in the background so the workspace stays live.
              </p>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-[1.5rem] border border-red-200 bg-red-50/85 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Link className="glass-pill glass-hover rounded-full px-4 py-2" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="glass-pill glass-hover rounded-full px-4 py-2" href="/terms-of-service">
              Terms of Service
            </Link>
          </div>
        </section>

        <section className="animate-slide-up-fade relative flex min-h-[720px] items-center justify-center delay-100">
          <div className="soft-grid absolute inset-0 rounded-[2.5rem] opacity-50" />
          <div className="absolute right-4 top-4 z-20 w-full max-w-[280px]">
            <LocalDeskWidget initialStatus={deskStatus} />
          </div>
          <div className="absolute inset-x-12 top-10 h-32 rounded-full bg-blue-500/8 blur-3xl" />
          <div className="floating-card relative w-full max-w-[640px]">
            <div className="absolute -left-8 top-16 h-[82%] w-full rounded-[2rem] bg-white/36 blur-sm" />
            <div className="absolute -right-4 top-10 h-[86%] w-full rounded-[2rem] bg-[linear-gradient(180deg,rgba(93,108,255,0.12),rgba(85,211,255,0.04))] blur-sm" />
            <div className="premium-surface relative rounded-[2.25rem] p-5">
              <div className="liquid-glass mb-4 flex items-center justify-between rounded-[1.75rem] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(89,108,255,1),rgba(75,198,255,0.9))] text-white">
                    <CloudIcon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">CloudStream OS</p>
                    <p className="text-sm text-muted-foreground">A premium Drive dashboard</p>
                  </div>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  LIVE
                </div>
              </div>

              <div className="space-y-4">
                <div className="topbar-shadow liquid-glass rounded-[1.75rem] p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-300" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Search folder or file</p>
                      <p className="font-medium text-foreground">Car Video.mp4</p>
                    </div>
                    <Button size="sm">Search</Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="sidebar-shadow liquid-glass rounded-[1.75rem] p-4">
                    <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Navigation
                    </div>
                    <div className="space-y-2">
                      {[
                        "All files",
                        "Photos",
                        "Starred",
                        "Recent",
                        "Shared",
                      ].map((item, index) => (
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm ${
                            index === 0
                              ? "border border-white/30 bg-[linear-gradient(180deg,rgba(99,113,255,0.92),rgba(95,158,255,0.78))] text-white shadow-[0_20px_46px_-28px_rgba(74,102,255,0.52),inset_0_1px_0_rgba(255,255,255,0.24)]"
                              : "glass-pill text-foreground"
                          }`}
                          key={item}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="liquid-glass rounded-[1.75rem] p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="font-semibold">Live status</p>
                        <p className="text-sm text-emerald-600">Connected</p>
                      </div>
                      <div className="space-y-3">
                        {[
                          ["Storage usage", "75% of 15GB used"],
                          ["Videos syncing", "1,204 videos indexed"],
                          ["Last playback", "Resume-ready across devices"],
                        ].map(([label, value]) => (
                          <div className="glass-pill glass-hover rounded-[1.25rem] p-3" key={label}>
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                            <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="liquid-glass rounded-[1.75rem] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-semibold">All files</p>
                        <p className="text-sm text-muted-foreground">Table view</p>
                      </div>
                      <div className="space-y-2">
                        {[
                          "Financial report.xls",
                          "essay_english.docs",
                          "Car Video.mp4",
                        ].map((item) => (
                          <div className="glass-pill glass-hover flex items-center justify-between rounded-2xl px-3 py-3 text-sm" key={item}>
                            <span className="max-w-[68%] truncate font-medium">{item}</span>
                            <span className="text-muted-foreground">Open</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
