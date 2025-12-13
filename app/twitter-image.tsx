import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "GPT Wrapped - Your ChatGPT Year in Review";
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* Background gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            backgroundColor: "rgba(168, 85, 247, 0.2)",
            borderRadius: 200,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            backgroundColor: "rgba(236, 72, 153, 0.2)",
            borderRadius: 200,
          }}
        />

        {/* Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            backgroundColor: "#a855f7",
            borderRadius: 24,
            marginBottom: 28,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 900,
            color: "#a855f7",
            marginBottom: 12,
          }}
        >
          GPT Wrapped
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          Your year with ChatGPT, beautifully visualized
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
