import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Revibe - Beauty Product Tracker",
        short_name: "Revibe",
        description: "Rethink your beauty habits. Track, reflect, and revive your beauty products one product at a time.",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#7c3aed",
        scope: "/",
        categories: ["lifestyle", "health", "productivity"],
        lang: "en-US",
        dir: "ltr",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
