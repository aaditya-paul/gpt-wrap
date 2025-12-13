import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "GPT Wrapped - Your ChatGPT Year in Review",
  description:
    "Discover your ChatGPT usage patterns with beautiful visualizations. Like Spotify Wrapped, but for your AI conversations.",
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
