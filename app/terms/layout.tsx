import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using GPT Wrapped - your ChatGPT year in review visualization tool.",
  openGraph: {
    title: "Terms & Conditions | GPT Wrapped",
    description:
      "Terms and conditions for using GPT Wrapped - your ChatGPT year in review visualization tool.",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
