import { auth } from "@/auth";
import { DriveDashboard } from "@/components/cloudstream/drive-dashboard";
import { LandingPanel } from "@/components/cloudstream/landing-panel";
import { hasAuthEnv } from "@/lib/env";
import {
  getDriveFileMetadata,
  getFolderBreadcrumbs,
  listDriveItems,
  type DriveView,
} from "@/lib/google-drive";

type SearchParamValue = string | string[] | undefined;

type HomePageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

const allowedViews = new Set<DriveView>(["my-drive", "shared", "starred", "recent"]);

function getSingleValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const authReady = hasAuthEnv();

  if (!authReady) {
    return (
      <LandingPanel
        authReady={false}
        errorMessage="Set NEXTAUTH_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET in .env.local before signing in."
      />
    );
  }

  const session = await auth();

  if (!session?.user) {
    return <LandingPanel />;
  }

  const params = await searchParams;
  const rawView = getSingleValue(params.view);
  const view = allowedViews.has(rawView as DriveView) ? (rawView as DriveView) : "my-drive";
  const folderId = getSingleValue(params.folderId) ?? (view === "my-drive" ? "root" : undefined);
  const query = getSingleValue(params.q) ?? "";
  const videosOnly = getSingleValue(params.videos) === "1";
  const selectedVideoId = getSingleValue(params.videoId);
  const accessToken = session.accessToken;

  if (!accessToken) {
    return <LandingPanel errorMessage="Your Drive session is missing an access token. Please sign in again." />;
  }

  const [items, breadcrumbs, selectedVideo] = await Promise.all([
    listDriveItems({ accessToken, view, folderId, query, videosOnly }),
    getFolderBreadcrumbs(accessToken, folderId),
    selectedVideoId ? getDriveFileMetadata(accessToken, selectedVideoId) : Promise.resolve(null),
  ]);

  return (
    <DriveDashboard
      breadcrumbs={breadcrumbs}
      currentFolderId={folderId}
      currentQuery={query}
      currentView={view}
      items={items}
      selectedVideo={selectedVideo}
      userName={session.user.name ?? session.user.email ?? "KM"}
      videosOnly={videosOnly}
    />
  );
}
