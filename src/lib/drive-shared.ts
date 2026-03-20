export type DriveView = "my-drive";

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

export function isVideoFile(item: Pick<DriveItem, "mimeType">) {
  return item.mimeType.startsWith("video/");
}

export function isFolder(item: Pick<DriveItem, "mimeType">) {
  return item.mimeType === "application/vnd.google-apps.folder";
}
