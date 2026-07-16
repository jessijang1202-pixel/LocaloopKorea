import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Localoop Korea",
    short_name: "Localoop",
    description: "Region-based living navigation and community platform for foreigners and Koreans",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1828",
    theme_color: "#1EC8C8",
    orientation: "portrait",
    icons: [
      {
        src: "/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
