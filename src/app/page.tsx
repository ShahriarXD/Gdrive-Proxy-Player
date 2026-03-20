import { auth } from "@/auth";
import { DriveDashboard } from "@/components/cloudstream/drive-dashboard";
import { LandingPanel } from "@/components/cloudstream/landing-panel";
import { getDeskStatus } from "@/lib/desk-status";
import { isVideoFile, type DriveView } from "@/lib/drive-shared";
import { hasAuthEnv } from "@/lib/env";
import {
  getDriveFileMetadata,
  getFolderBreadcrumbs,
  getDriveStorageStatus,
  listDriveItems,
} from "@/lib/google-drive";

type SearchParamValue = string | string[] | undefined;

type HomePageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

const allowedViews = new Set<DriveView>(["my-drive"]);

function getSingleValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const authReady = hasAuthEnv();
  const deskStatus = await getDeskStatus();

  if (!authReady) {
    return <LandingPanel deskStatus={deskStatus} />;
  }

  const session = await auth();

  if (!session?.user) {
    return <LandingPanel deskStatus={deskStatus} />;
  }

  const params = await searchParams;
  const rawView = getSingleValue(params.view);
  const view = allowedViews.has(rawView as DriveView) ? (rawView as DriveView) : "my-drive";
  const folderId = getSingleValue(params.folderId) ?? "root";
  const query = getSingleValue(params.q) ?? "";
  const videosOnly = getSingleValue(params.videos) === "1";
  const selectedVideoId = getSingleValue(params.videoId);
  const accessToken = session.accessToken;

  if (!accessToken) {
    return <LandingPanel deskStatus={deskStatus} />;
  }

  const [items, breadcrumbs, selectedVideoFromUrl, storageStatus] = await Promise.all([
    listDriveItems({ accessToken, view, folderId, query, videosOnly }),
    getFolderBreadcrumbs(accessToken, folderId),
    selectedVideoId ? getDriveFileMetadata(accessToken, selectedVideoId) : Promise.resolve(null),
    getDriveStorageStatus(accessToken),
  ]);

  const normalizedQuery = query.trim().toLowerCase();
  const autoSelectedVideo =
    !selectedVideoId && normalizedQuery
      ? items.find((item) => {
          if (!isVideoFile(item)) {
            return false;
          }

          const normalizedName = item.name.trim().toLowerCase();
          return (
            normalizedName === normalizedQuery ||
            (items.filter((candidate) => isVideoFile(candidate)).length === 1 &&
              normalizedName.includes(normalizedQuery))
          );
        }) ?? null
      : null;
  const selectedVideo = selectedVideoFromUrl ?? autoSelectedVideo;

  return (
    <DriveDashboard
      breadcrumbs={breadcrumbs}
      currentFolderId={folderId}
      currentQuery={query}
      currentView={view}
      deskStatus={deskStatus}
      items={items}
      selectedVideo={selectedVideo}
      storageStatus={storageStatus}
      userImage={session.user.image}
      userName={session.user.name ?? session.user.email ?? "KM"}
      videosOnly={videosOnly}
    />
  );
}
