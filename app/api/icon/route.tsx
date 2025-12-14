import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const size = parseInt(searchParams.get("size") || "32");

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#a855f7",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: Math.floor(size * 0.1875),
        }}
      >
        <svg
          width={Math.floor(size * 0.625)}
          height={Math.floor(size * 0.625)}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      width: size,
      height: size,
    }
  );
}
