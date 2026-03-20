import { auth } from "@/auth";
import { getDriveFileMetadata } from "@/lib/google-drive";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const FORWARDED_HEADERS = [
  "accept-ranges",
  "cache-control",
  "content-disposition",
  "content-length",
  "content-range",
  "content-type",
  "etag",
  "last-modified",
] as const;

export async function GET(
  request: Request,
  context: { params: Promise<{ fileId: string }> }
) {
  const session = await auth();

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { fileId } = await context.params;
  const metadata = await getDriveFileMetadata(session.accessToken, fileId);

  if (!metadata.mimeType.startsWith("video/")) {
    return new Response("Only video files can be streamed.", { status: 415 });
  }

  const mediaUrl = new URL(`https://www.googleapis.com/drive/v3/files/${fileId}`);
  mediaUrl.searchParams.set("alt", "media");
  mediaUrl.searchParams.set("supportsAllDrives", "true");

  const range = request.headers.get("range");
  const upstream = await fetch(mediaUrl, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      ...(range ? { Range: range } : {}),
    },
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Unable to read the video stream.", { status: upstream.status });
  }

  const headers = new Headers();

  FORWARDED_HEADERS.forEach((header) => {
    const value = upstream.headers.get(header);
    if (value) {
      headers.set(header, value);
    }
  });

  headers.set("x-content-type-options", "nosniff");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
