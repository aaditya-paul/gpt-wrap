import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Wrapped",
  description:
    "View your personalized ChatGPT Wrapped - beautiful animated slides showcasing your AI conversation journey, usage patterns, and statistics.",
  openGraph: {
    title: "Your GPT Wrapped",
    description:
      "View your personalized ChatGPT Wrapped - beautiful animated slides showcasing your AI conversation journey.",
  },
};

export default function WrappedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
