import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about GPT Wrapped - a privacy-first tool to visualize your ChatGPT conversations like Spotify Wrapped. 100% client-side processing.",
  openGraph: {
    title: "About GPT Wrapped",
    description:
      "Learn about GPT Wrapped - a privacy-first tool to visualize your ChatGPT conversations like Spotify Wrapped.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
