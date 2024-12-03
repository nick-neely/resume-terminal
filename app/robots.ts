import type { MetadataRoute } from "next";
import { url } from "./layout";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/**",
    },
    sitemap: `${url}sitemap.xml`,
  };
}
