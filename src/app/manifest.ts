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
        src: "/app-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
