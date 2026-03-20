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

const DRIVE_FILE_ID_PATTERN = /^[A-Za-z0-9_-]{10,}$/;
const BYTE_RANGE_PATTERN = /^bytes=(\d*)-(\d*)$/;

function sanitizeFilename(value: string) {
  return value
    .replace(/[\r\n"]/g, "")
    .replace(/[^\w.()\-\s]/g, "_")
    .trim()
    .slice(0, 180);
}

function isValidRangeHeader(range: string | null) {
  if (!range) {
    return true;
  }

  return BYTE_RANGE_PATTERN.test(range.trim());
}

async function handleStreamRequest(
  request: Request,
  context: { params: Promise<{ fileId: string }> }
) {
  const session = await auth();

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { fileId } = await context.params;

  if (!DRIVE_FILE_ID_PATTERN.test(fileId)) {
    return new Response("Invalid file id.", { status: 400 });
  }

  const range = request.headers.get("range");

  if (!isValidRangeHeader(range)) {
    return new Response("Invalid range header.", { status: 400 });
  }

  const metadata = await getDriveFileMetadata(session.accessToken, fileId);

  if (!metadata.mimeType.startsWith("video/")) {
    return new Response("Only video files can be streamed.", { status: 415 });
  }

  const mediaUrl = new URL(`https://www.googleapis.com/drive/v3/files/${fileId}`);
  mediaUrl.searchParams.set("alt", "media");
  mediaUrl.searchParams.set("supportsAllDrives", "true");

  const upstream = await fetch(mediaUrl, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      ...(range ? { Range: range } : {}),
    },
  });

  if (!upstream.ok) {
    const details = await upstream.text();
    console.error("Google Drive stream failed", {
      fileId,
      status: upstream.status,
      reason: details.slice(0, 300),
    });

    return new Response("Unable to read the video stream.", {
      status: upstream.status,
    });
  }

  if (request.method === "GET" && !upstream.body) {
    return new Response("Unable to read the video stream.", { status: 502 });
  }

  const headers = new Headers();

  FORWARDED_HEADERS.forEach((header) => {
    const value = upstream.headers.get(header);
    if (value) {
      headers.set(header, value);
    }
  });

  if (!headers.has("content-type")) {
    headers.set("content-type", metadata.mimeType);
  }

  if (!headers.has("accept-ranges")) {
    headers.set("accept-ranges", "bytes");
  }

  if (!headers.has("content-disposition")) {
    const safeFilename = sanitizeFilename(metadata.name || "video");
    headers.set("content-disposition", `inline; filename="${safeFilename || "video"}"`);
  }

  headers.set("x-content-type-options", "nosniff");
  headers.set("cache-control", "private, no-store, max-age=0");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ fileId: string }> }
) {
  return handleStreamRequest(request, context);
}

export async function HEAD(
  request: Request,
  context: { params: Promise<{ fileId: string }> }
) {
  return handleStreamRequest(request, context);
}
