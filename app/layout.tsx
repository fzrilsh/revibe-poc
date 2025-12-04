import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Revibe - Skincare",
    description: "Rethink your beauty habits. Track, reflect, and revive your beauty products one product at a time.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" className="scrollbar-hide">
            <body className={`font-euclid antialiased box-border`}>{children}</body>
        </html>
    );
}
