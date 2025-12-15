import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gpt-wrap-psi.vercel.ap";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/wrapped/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
