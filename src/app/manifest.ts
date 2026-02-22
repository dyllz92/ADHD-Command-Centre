import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ADHD Command Centre",
    short_name: "ADHD Command",
    description: "Calm command dashboard for ADHD support",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F5F2",
    theme_color: "#F7F5F2",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
