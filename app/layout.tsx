import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConversationProvider } from "@/context/ConversationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://gpt-wrapped.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "GPT Wrapped - Your ChatGPT Year in Review",
    template: "%s | GPT Wrapped",
  },
  description:
    "Discover your ChatGPT usage patterns with beautiful visualizations. Like Spotify Wrapped, but for your AI conversations. 100% private, all processing in your browser.",
  keywords: [
    "ChatGPT",
    "GPT Wrapped",
    "AI analytics",
    "ChatGPT statistics",
    "ChatGPT wrapped",
    "AI conversation analysis",
    "ChatGPT year in review",
    "OpenAI",
    "conversation analytics",
    "AI usage stats",
  ],
  authors: [{ name: "Aaditya Paul", url: "https://github.com/aaditya-paul" }],
  creator: "Aaditya Paul",
  publisher: "Aaditya Paul",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "GPT Wrapped",
    title: "GPT Wrapped - Your ChatGPT Year in Review",
    description:
      "Discover your ChatGPT usage patterns with beautiful visualizations. Like Spotify Wrapped, but for your AI conversations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPT Wrapped - Your ChatGPT Year in Review",
    description:
      "Discover your ChatGPT usage patterns with beautiful visualizations. Like Spotify Wrapped, but for your AI conversations.",
    creator: "@aaditya_paul",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/api/icon?size=32", sizes: "32x32", type: "image/png" },
      { url: "/api/icon?size=48", sizes: "48x48", type: "image/png" },
      { url: "/api/icon?size=64", sizes: "64x64", type: "image/png" },
    ],
    apple: {
      url: "/api/apple-icon?size=180",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#a855f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0a0a0a]`}
      >
        <ConversationProvider>{children}</ConversationProvider>
      </body>
    </html>
  );
}
