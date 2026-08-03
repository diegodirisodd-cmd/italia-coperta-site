import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Di Riso Teloni — Italia Coperta",
    short_name: "Di Riso Teloni",
    description:
      "Teli per bilico, teloni per camion e tensostrutture industriali su misura dal 1950.",
    start_url: "/",
    display: "standalone",
    background_color: "#1A1980",
    theme_color: "#E31919",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
