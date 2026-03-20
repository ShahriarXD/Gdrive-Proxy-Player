import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 22% 24%, rgba(34,211,238,0.32), transparent 35%), radial-gradient(circle at 85% 18%, rgba(59,130,246,0.3), transparent 34%), linear-gradient(135deg, #0b1f49 0%, #0f3d8f 45%, #0ea5e9 100%)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "64px",
          width: "100%",
          color: "#ffffff",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 999,
            fontSize: 28,
            letterSpacing: "0.16em",
            marginBottom: 32,
            opacity: 0.95,
            padding: "10px 20px",
            textTransform: "uppercase",
          }}
        >
          CloudStream by KM
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: 980,
            textAlign: "center",
          }}
        >
          Browse and Stream
          <br />
          Your Google Drive Videos
        </div>
        <div
          style={{
            fontSize: 34,
            marginTop: 30,
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          Private, fast, and clean video workspace
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
