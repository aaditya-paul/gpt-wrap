import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "GPT Wrapped - Your ChatGPT Year in Review";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OGImage() {
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
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
          position: "relative",
        }}
      >
        {/* Background gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
            borderRadius: "28px",
            marginBottom: "32px",
            boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.5)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: 900,
            background: "linear-gradient(90deg, #a855f7, #ec4899, #f97316)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "16px",
            letterSpacing: "-2px",
          }}
        >
          GPT Wrapped
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#9ca3af",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Your year with ChatGPT, beautifully visualized
        </div>

        {/* Feature badges */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
          }}
        >
          {[
            "🎨 Wrapped Experience",
            "📊 Deep Analytics",
            "🔒 Privacy First",
          ].map((feature) => (
            <div
              key={feature}
              style={{
                padding: "12px 24px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50px",
                color: "#d1d5db",
                fontSize: "18px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
