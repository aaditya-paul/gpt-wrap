import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "GPT Wrapped privacy policy. Your data never leaves your device - all processing happens 100% client-side in your browser.",
  openGraph: {
    title: "Privacy Policy | GPT Wrapped",
    description:
      "Your data never leaves your device - all processing happens 100% client-side in your browser.",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
