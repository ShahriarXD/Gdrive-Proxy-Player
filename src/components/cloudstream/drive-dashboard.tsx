import {
  ChevronRightIcon,
  Clock3Icon,
  FileIcon,
  FolderIcon,
  ImageIcon,
  LayoutGridIcon,
  MonitorPlayIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { DriveToolbar } from "@/components/cloudstream/drive-toolbar";
import { VideoPlayerDialog } from "@/components/cloudstream/video-player-dialog";
import { Button } from "@/components/ui/button";
import {
  formatBytes,
  formatDate,
} from "@/lib/utils";
import {
  isFolder,
  isVideoFile,
  type DriveItem,
  type DriveView,
} from "@/lib/google-drive";

type Breadcrumb = {
  id: string;
  name: string;
};

type DriveDashboardProps = {
  breadcrumbs: Breadcrumb[];
  currentFolderId?: string;
  currentQuery: string;
  currentView: DriveView;
  items: DriveItem[];
  selectedVideo: DriveItem | null;
  userName: string;
  videosOnly: boolean;
};

const viewMeta: Record<
  DriveView,
  { icon: typeof LayoutGridIcon; label: string; description: string }
> = {
  "my-drive": {
    icon: LayoutGridIcon,
    label: "My Drive",
    description: "Your primary Google Drive space",
  },
  shared: {
    icon: UsersIcon,
    label: "Shared with Me",
    description: "Items others have shared with you",
  },
  starred: {
    icon: StarIcon,
    label: "Starred",
    description: "Pinned files and folders",
  },
  recent: {
    icon: Clock3Icon,
    label: "Recent",
    description: "Files you opened most recently",
  },
};

function getItemIcon(item: DriveItem) {
  if (isFolder(item)) {
    return FolderIcon;
  }

  if (isVideoFile(item)) {
    return MonitorPlayIcon;
  }

  if (item.mimeType.startsWith("image/")) {
    return ImageIcon;
  }

  return FileIcon;
}

function buildHref(
  view: DriveView,
  overrides: Record<string, string | undefined>,
  currentQuery: string,
  videosOnly: boolean
): Route {
  const params = new URLSearchParams();
  params.set("view", view);

  if (currentQuery) {
    params.set("q", currentQuery);
  }

  if (videosOnly) {
    params.set("videos", "1");
  }

  Object.entries(overrides).forEach(([key, value]) => {
    if (!value) {
      params.delete(key);
      return;
    }

    params.set(key, value);
  });

  return `/?${params.toString()}` as Route;
}

export function DriveDashboard({
  breadcrumbs,
  currentFolderId,
  currentQuery,
  currentView,
  items,
  selectedVideo,
  userName,
  videosOnly,
}: DriveDashboardProps) {
  const view = viewMeta[currentView];

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[1560px] gap-6 px-4 py-4 md:px-6 lg:px-8">
        <aside className="glass-panel hidden w-80 shrink-0 rounded-[2rem] p-5 lg:flex lg:flex-col lg:gap-6">
          <div className="rounded-[1.5rem] bg-slate-950 px-5 py-6 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">
              CloudStream
            </p>
            <h1 className="mt-3 text-2xl font-semibold">KM Workspace</h1>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Stream your Drive videos through a private edge proxy.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {Object.entries(viewMeta).map(([key, value]) => {
              const Icon = value.icon;
              const active = key === currentView;

              return (
                <Link
                  className={`rounded-[1.25rem] px-4 py-3 transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-white/60 text-foreground hover:bg-white"
                  }`}
                  href={buildHref(key as DriveView, { folderId: undefined, videoId: undefined }, "", false)}
                  key={key}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4" />
                    <div>
                      <p className="text-sm font-medium">{value.label}</p>
                      <p className={`text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex items-center justify-between rounded-[1.25rem] border border-white/50 bg-white/60 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Signed in as
              </p>
              <p className="text-sm font-medium text-foreground">{userName}</p>
            </div>
            <SignOutButton />
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-6">
          <header className="glass-panel rounded-[2rem] p-5 md:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Drive view</span>
                    <ChevronRightIcon className="size-4" />
                    <span>{view.label}</span>
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                    {view.label}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Browse folders, open Drive files, and launch videos in the modal
                    player without leaving the dashboard.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-start">
                  <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-4 py-2 text-sm text-muted-foreground">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Range-enabled proxy online
                  </div>
                  <div className="lg:hidden">
                    <SignOutButton />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:hidden">
                {Object.entries(viewMeta).map(([key, value]) => {
                  const active = key === currentView;

                  return (
                    <Link
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/75 text-foreground hover:bg-white"
                      }`}
                      href={buildHref(
                        key as DriveView,
                        { folderId: undefined, videoId: undefined },
                        "",
                        false
                      )}
                      key={key}
                    >
                      {value.label}
                    </Link>
                  );
                })}
              </div>

              <DriveToolbar defaultQuery={currentQuery} videosOnly={videosOnly} />

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Link className="rounded-full bg-white/75 px-3 py-1.5 hover:bg-white" href={buildHref(currentView, { folderId: undefined, videoId: undefined }, currentQuery, videosOnly)}>
                  Root
                </Link>
                {breadcrumbs.map((breadcrumb) => (
                  <div className="flex items-center gap-2" key={breadcrumb.id}>
                    <ChevronRightIcon className="size-4" />
                    <Link
                      className="rounded-full bg-white/75 px-3 py-1.5 hover:bg-white"
                      href={buildHref(
                        currentView,
                        { folderId: breadcrumb.id, videoId: undefined },
                        currentQuery,
                        videosOnly
                      )}
                    >
                      {breadcrumb.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <div className="glass-panel rounded-[2rem] p-5 md:p-6">
            {items.length ? (
              <div className="dashboard-grid grid gap-4">
                {items.map((item) => {
                  const Icon = getItemIcon(item);
                  const internalHref = isFolder(item)
                    ? buildHref(
                        currentView,
                        { folderId: item.id, videoId: undefined },
                        currentQuery,
                        videosOnly
                      )
                    : isVideoFile(item)
                      ? buildHref(
                          currentView,
                          {
                            folderId: currentFolderId,
                            videoId: item.id,
                          },
                          currentQuery,
                          videosOnly
                        )
                      : null;
                  const externalHref = !internalHref ? item.webViewLink ?? "#" : null;

                  const external = !isFolder(item) && !isVideoFile(item);

                  return (
                    <article
                      className="group flex h-full flex-col justify-between rounded-[1.5rem] border border-white/50 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
                      key={item.id}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                            <Icon className="size-5" />
                          </div>
                          {isVideoFile(item) ? (
                            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700">
                              Streamable
                            </span>
                          ) : null}
                        </div>

                        <div>
                          <h3 className="line-clamp-2 text-base font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {isFolder(item)
                              ? "Folder"
                              : isVideoFile(item)
                                ? "Video"
                                : item.mimeType}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-4">
                        <dl className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>
                            <dt>Modified</dt>
                            <dd className="mt-1 text-foreground">{formatDate(item.modifiedTime)}</dd>
                          </div>
                          <div>
                            <dt>Size</dt>
                            <dd className="mt-1 text-foreground">{formatBytes(item.size)}</dd>
                          </div>
                        </dl>

                        <Button asChild variant={isVideoFile(item) ? "default" : "outline"}>
                          {external ? (
                            <a href={externalHref ?? "#"} rel="noreferrer" target="_blank">
                              Open file
                            </a>
                          ) : (
                            <Link href={internalHref ?? "/"}>
                              {isFolder(item)
                                ? "Open folder"
                                : isVideoFile(item)
                                  ? "Play video"
                                  : "Open file"}
                            </Link>
                          )}
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-dashed border-border bg-white/50 px-6 text-center">
                <MonitorPlayIcon className="size-10 text-muted-foreground" />
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    No files match this view yet
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Try a different view, clear the search query, or turn off the
                    video-only filter.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <VideoPlayerDialog
        fileId={selectedVideo?.id}
        fileName={selectedVideo?.name}
        mimeType={selectedVideo?.mimeType}
      />
    </>
  );
}
