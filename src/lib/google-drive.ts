import "server-only";

export type DriveView = "my-drive" | "shared" | "starred" | "recent";

export type DriveItem = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  viewedByMeTime?: string;
  parents?: string[];
  iconLink?: string;
  webViewLink?: string;
};

export type DriveStorageStatus = {
  usage?: string;
  limit?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
};

type DriveListResponse = {
  files?: DriveItem[];
};

type DriveFileResponse = DriveItem;

type DriveAboutResponse = {
  storageQuota?: DriveStorageStatus;
};

type DriveRequestOptions = {
  accessToken: string;
  folderId?: string;
  query?: string;
  videosOnly?: boolean;
  view: DriveView;
};

type Breadcrumb = {
  id: string;
  name: string;
};

const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3/files";
const DEFAULT_FIELDS =
  "files(id,name,mimeType,size,modifiedTime,viewedByMeTime,parents,iconLink,webViewLink)";

function buildQuery({ folderId, query, videosOnly, view }: DriveRequestOptions) {
  const filters = ["trashed = false"];
  const hasSearchQuery = Boolean(query?.trim());

  if (!hasSearchQuery && folderId && folderId !== "root") {
    filters.push(`'${folderId}' in parents`);
  } else if (!hasSearchQuery && view === "my-drive") {
    filters.push("'root' in parents");
  }

  if (hasSearchQuery) {
    const escaped = query!.trim().replace(/'/g, "\\'");
    filters.push(`(name contains '${escaped}' or fullText contains '${escaped}')`);
  }

  if (videosOnly) {
    filters.push("mimeType contains 'video/'");
  }

  return filters.join(" and ");
}

function buildOrdering(view: DriveView, query?: string) {
  if (query?.trim()) {
    return undefined;
  }

  void view;

  return "folder,name_natural";
}

async function driveFetch<T>(accessToken: string, url: URL, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Google Drive API request failed: ${message}`);
  }

  return (await response.json()) as T;
}

export async function listDriveItems(options: DriveRequestOptions) {
  const url = new URL(DRIVE_API_BASE);
  url.searchParams.set("q", buildQuery(options));
  url.searchParams.set("fields", DEFAULT_FIELDS);
  url.searchParams.set("pageSize", "100");
  const ordering = buildOrdering(options.view, options.query);

  if (ordering) {
    url.searchParams.set("orderBy", ordering);
  }

  url.searchParams.set("supportsAllDrives", "true");
  url.searchParams.set("includeItemsFromAllDrives", "true");

  const response = await driveFetch<DriveListResponse>(options.accessToken, url);
  return response.files ?? [];
}

export async function getDriveFileMetadata(accessToken: string, fileId: string) {
  const url = new URL(`${DRIVE_API_BASE}/${fileId}`);
  url.searchParams.set(
    "fields",
    "id,name,mimeType,size,parents,modifiedTime,viewedByMeTime,webViewLink"
  );
  url.searchParams.set("supportsAllDrives", "true");

  return driveFetch<DriveFileResponse>(accessToken, url);
}

export async function getDriveStorageStatus(accessToken: string) {
  const url = new URL("https://www.googleapis.com/drive/v3/about");
  url.searchParams.set(
    "fields",
    "storageQuota(limit,usage,usageInDrive,usageInDriveTrash)"
  );

  const response = await driveFetch<DriveAboutResponse>(accessToken, url);
  return response.storageQuota ?? null;
}

export async function getFolderBreadcrumbs(accessToken: string, folderId?: string) {
  if (!folderId || folderId === "root") {
    return [] as Breadcrumb[];
  }

  const segments: Breadcrumb[] = [];
  let currentId: string | undefined = folderId;

  while (currentId && currentId !== "root") {
    const folder = await getDriveFileMetadata(accessToken, currentId);
    segments.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parents?.[0];
  }

  return segments;
}

export function isVideoFile(item: Pick<DriveItem, "mimeType">) {
  return item.mimeType.startsWith("video/");
}

export function isFolder(item: Pick<DriveItem, "mimeType">) {
  return item.mimeType === "application/vnd.google-apps.folder";
}
