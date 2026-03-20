import {
  CloudIcon,
  FolderIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  VideoIcon,
} from "lucide-react";

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
    <main className="relative mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-6 py-10 md:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-20 size-40 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute right-[10%] top-[18%] size-56 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-16 left-[34%] size-64 rounded-full bg-violet-300/20 blur-3xl" />
      </div>

      <div className="relative grid w-full gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="animate-slide-up-fade flex flex-col justify-between gap-8 rounded-[2.25rem] border border-white/70 bg-white/72 p-8 shadow-[0_40px_120px_-58px_rgba(50,65,120,0.38)] backdrop-blur-2xl lg:p-10">
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
              KM Edition
            </div>
          </div>

          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
              <SparklesIcon className="size-4 text-cyan-300" />
              Inspired by premium cloud productivity dashboards
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-foreground md:text-7xl">
              Turn your Google Drive into a cinematic workspace.
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              Search like a command center, move through folders with desktop-class
              clarity, and stream Drive videos instantly through a proxy built for Vercel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <GoogleSignInButton disabled={!authReady} />
            <Button asChild size="lg" variant="secondary">
              <a
                href="https://developers.google.com/drive/api/guides/enable-drive-api"
                rel="noreferrer"
                target="_blank"
              >
                Enable Drive API
              </a>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="premium-border rounded-[1.5rem] bg-white/74 p-4">
              <FolderIcon className="mb-4 size-5 text-primary" />
              <p className="text-sm font-medium text-foreground">Folder-first navigation</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Browse Drive like a refined file system, not a raw API response.
              </p>
            </div>
            <div className="premium-border rounded-[1.5rem] bg-white/74 p-4">
              <PlayCircleIcon className="mb-4 size-5 text-cyan-500" />
              <p className="text-sm font-medium text-foreground">Instant video streaming</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Range-aware playback gives fast scrubbing and lightweight delivery.
              </p>
            </div>
            <div className="premium-border rounded-[1.5rem] bg-white/74 p-4">
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
        </section>

        <section className="animate-slide-up-fade relative flex min-h-[720px] items-center justify-center delay-100">
          <div className="soft-grid absolute inset-0 rounded-[2.5rem] opacity-50" />
          <div className="absolute inset-x-12 top-10 h-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="floating-card relative w-full max-w-[640px]">
            <div className="absolute -left-10 top-16 h-[82%] w-full rounded-[2rem] bg-white/45 blur-md" />
            <div className="absolute -right-6 top-10 h-[86%] w-full rounded-[2rem] bg-[linear-gradient(180deg,rgba(93,108,255,0.16),rgba(85,211,255,0.08))] blur-sm" />
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,249,255,0.86))] p-5 shadow-[0_42px_120px_-55px_rgba(52,73,140,0.45)]">
              <div className="mb-4 flex items-center justify-between rounded-[1.75rem] border border-white/80 bg-white/88 px-4 py-3">
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
                <div className="topbar-shadow rounded-[1.75rem] border border-white/80 bg-white/88 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-300" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Search folder or file</p>
                      <p className="font-medium text-foreground">Blind-Date-Episode-1-Aaliyah-and-Isiah-CQIS6qU8.mp4</p>
                    </div>
                    <Button size="sm">Search</Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="sidebar-shadow rounded-[1.75rem] border border-white/75 bg-white/86 p-4">
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
                              ? "bg-[linear-gradient(135deg,rgba(90,103,255,1),rgba(78,150,255,0.92))] text-white shadow-lg"
                              : "bg-slate-50 text-foreground"
                          }`}
                          key={item}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.75rem] border border-white/75 bg-white/86 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="font-semibold">Recently used</p>
                        <p className="text-sm text-muted-foreground">7 items</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "My projects",
                          "Family photo",
                          "NDA document",
                          "Episode file",
                        ].map((item, index) => (
                          <div className="rounded-[1.25rem] bg-slate-50 p-3" key={item}>
                            <div className="mb-8 flex size-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                              {index === 3 ? <VideoIcon className="size-4" /> : <FolderIcon className="size-4" />}
                            </div>
                            <p className="truncate text-sm font-medium">{item}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {index === 3 ? "MP4, 218 MB" : "Folder"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/75 bg-white/86 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-semibold">All files</p>
                        <p className="text-sm text-muted-foreground">Table view</p>
                      </div>
                      <div className="space-y-2">
                        {[
                          "Financial report.xls",
                          "essay_english.docs",
                          "Blind-Date-Episode-1-Aaliyah-and-Isiah-CQIS6qU8.mp4",
                        ].map((item) => (
                          <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3 text-sm" key={item}>
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
