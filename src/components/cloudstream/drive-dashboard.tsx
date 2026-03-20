import {
  BellIcon,
  ChevronRightIcon,
  Clock3Icon,
  FileIcon,
  FolderIcon,
  HelpCircleIcon,
  ImageIcon,
  LayoutGridIcon,
  MoreHorizontalIcon,
  MonitorPlayIcon,
  SearchIcon,
  Settings2Icon,
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
  formatFileName,
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
  const recentItems = items.slice(0, 5);

  return (
    <>
      <main className="mx-auto grid min-h-screen w-full max-w-[1680px] gap-0 px-3 py-3 md:px-5 md:py-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="sidebar-shadow hidden min-h-[calc(100vh-2rem)] shrink-0 rounded-[2rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(249,250,255,0.72))] p-5 lg:flex lg:flex-col lg:gap-6">
          <div className="flex items-center gap-3 rounded-[1.6rem] px-2 py-2">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(90,103,255,1),rgba(85,185,255,0.92))] text-white shadow-[0_18px_50px_-24px_rgba(67,97,255,0.72)]">
              <SearchIcon className="size-5" />
            </div>
            <div>
              <p className="text-[1.6rem] font-semibold tracking-[-0.05em] text-foreground xl:text-[2rem]">CloudStream</p>
              <p className="text-sm text-muted-foreground">Drive workspace by KM</p>
            </div>
          </div>

          <nav className="space-y-2">
            {Object.entries(viewMeta).map(([key, value]) => {
              const Icon = value.icon;
              const active = key === currentView;

              return (
                <Link
                  className={`rounded-[1.2rem] px-4 py-3.5 transition ${
                    active
                      ? "bg-[linear-gradient(135deg,rgba(90,103,255,1),rgba(85,152,255,0.92))] text-primary-foreground shadow-[0_22px_50px_-28px_rgba(74,102,255,0.8)]"
                      : "bg-transparent text-foreground hover:bg-white/75"
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

          <div className="rounded-[1.5rem] border border-white/75 bg-white/68 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Recent folders
            </p>
            <div className="space-y-2">
              {breadcrumbs.length ? breadcrumbs.map((breadcrumb) => (
                <Link
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-foreground transition hover:bg-white/85"
                  href={buildHref(currentView, { folderId: breadcrumb.id, videoId: undefined }, currentQuery, videosOnly)}
                  key={breadcrumb.id}
                >
                  <FolderIcon className="size-4 text-primary" />
                  <span className="truncate">{breadcrumb.name}</span>
                </Link>
              )) : (
                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-muted-foreground">
                  Your root folder is ready.
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto rounded-[1.5rem] border border-white/75 bg-white/75 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-foreground">{userName}</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
            <SignOutButton />
          </div>
        </aside>

        <section className="min-w-0 rounded-[2rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,249,253,0.88))] p-4 md:p-6">
          <header className="topbar-shadow glass-panel rounded-[1.9rem] p-4 md:p-5">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="lg:hidden">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(90,103,255,1),rgba(85,185,255,0.92))] text-white">
                      <SearchIcon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">CloudStream</p>
                      <p className="text-sm text-muted-foreground">{view.label}</p>
                    </div>
                  </div>
                </div>
                <div className="hidden flex-1 lg:block">
                  <DriveToolbar defaultQuery={currentQuery} videosOnly={videosOnly} />
                </div>
                <div className="flex items-center gap-2">
                  {[HelpCircleIcon, Settings2Icon, BellIcon].map((Icon, index) => (
                    <button
                      className="flex size-11 items-center justify-center rounded-2xl border border-white/80 bg-white/84 text-slate-600 transition hover:-translate-y-0.5 hover:bg-white"
                      key={index}
                      type="button"
                    >
                      <Icon className="size-5" />
                    </button>
                  ))}
                  <div className="hidden size-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-500 md:flex">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="lg:hidden">
                <DriveToolbar defaultQuery={currentQuery} videosOnly={videosOnly} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Workspace</span>
                    <ChevronRightIcon className="size-4" />
                    <span>{view.label}</span>
                  </div>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">
                    {view.label}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
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

          <div className="mt-6 space-y-6">
            {recentItems.length ? (
              <section className="glass-panel section-enter rounded-[1.9rem] p-5 md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">Recently used</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Jump back into the files you touched most recently.
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    <Button size="icon" variant="outline">
                      <LayoutGridIcon className="size-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <MoreHorizontalIcon className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="dashboard-grid grid gap-4">
                  {recentItems.map((item) => {
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
                        className="premium-surface micro-lift group rounded-[1.6rem] p-4"
                        key={item.id}
                      >
                        <div className="mb-5 flex items-center justify-between">
                          <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-primary">
                            <Icon className="size-5" />
                          </div>
                          <button className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" type="button">
                            <MoreHorizontalIcon className="size-4" />
                          </button>
                        </div>
                        <h4 className="line-clamp-2 text-base font-semibold text-foreground">{formatFileName(item.name)}</h4>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {isFolder(item) ? "Folder" : isVideoFile(item) ? "Video file" : item.mimeType}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{formatBytes(item.size)}</p>
                        <div className="mt-5">
                          <Button asChild className="w-full" variant={isVideoFile(item) ? "default" : "secondary"}>
                            {external ? (
                              <a href={externalHref ?? "#"} rel="noreferrer" target="_blank">
                                Open file
                              </a>
                            ) : (
                              <Link href={internalHref ?? "/"}>
                                {isFolder(item) ? "Open folder" : isVideoFile(item) ? "Play video" : "Open file"}
                              </Link>
                            )}
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <section className="glass-panel section-enter rounded-[1.9rem] p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">All files</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A cleaner table view inspired by modern file platforms.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">Sort by</Button>
                  <Button size="icon" variant="outline">
                    <LayoutGridIcon className="size-4" />
                  </Button>
                </div>
              </div>

              {items.length ? (
                <>
                  <div className="space-y-3 md:hidden">
                    {items.map((item) => {
                      const Icon = getItemIcon(item);
                      const displayName = formatFileName(item.name);
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
                        <article className="premium-surface rounded-[1.5rem] p-4" key={item.id}>
                          <div className="flex items-start gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-[1.4rem] bg-slate-50 text-primary">
                              <Icon className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {isFolder(item) ? "Folder" : isVideoFile(item) ? "Video" : item.mimeType}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span>{formatDate(item.modifiedTime)}</span>
                                <span>{formatBytes(item.size)}</span>
                              </div>
                              <div className="mt-4">
                                <Button asChild size="sm" variant={isVideoFile(item) ? "default" : "outline"}>
                                  {external ? (
                                    <a href={externalHref ?? "#"} rel="noreferrer" target="_blank">
                                      Open
                                    </a>
                                  ) : (
                                    <Link href={internalHref ?? "/"}>
                                      {isFolder(item) ? "Open folder" : isVideoFile(item) ? "Play video" : "Open"}
                                    </Link>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="hidden overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/82 md:block">
                  <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(140px,0.7fr)_minmax(90px,0.45fr)_120px] gap-4 border-b border-slate-100 px-5 py-4 text-sm font-medium text-muted-foreground">
                    <span>Name</span>
                    <span>Last modified</span>
                    <span>Size</span>
                    <span className="text-right">Action</span>
                  </div>
                  <div>
                    {items.map((item) => {
                      const Icon = getItemIcon(item);
                      const displayName = formatFileName(item.name);
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
                        <div
                          className="grid grid-cols-[minmax(0,1.4fr)_minmax(140px,0.7fr)_minmax(90px,0.45fr)_120px] items-center gap-4 border-t border-slate-100 px-5 py-4 transition hover:bg-slate-50/80"
                          key={item.id}
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-50 text-primary">
                              <Icon className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {isFolder(item) ? "Folder" : isVideoFile(item) ? "Video" : item.mimeType}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">{formatDate(item.modifiedTime)}</div>
                          <div className="text-sm text-muted-foreground">{formatBytes(item.size)}</div>
                          <div className="flex justify-end">
                            <Button asChild size="sm" variant={isVideoFile(item) ? "default" : "outline"}>
                              {external ? (
                                <a href={externalHref ?? "#"} rel="noreferrer" target="_blank">
                                  Open
                                </a>
                              ) : (
                                <Link href={internalHref ?? "/"}>
                                  {isFolder(item) ? "Open" : isVideoFile(item) ? "Play" : "Open"}
                                </Link>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </>
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
            </section>
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
