import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to parse cookies
function getCookie(req: NextRequest, name: string) {
    const cookie = req.cookies.get(name);
    return cookie?.value ?? null;
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only guard /registration route
    if (pathname.startsWith("/registration")) {
        const token = getCookie(req, "rv_token");
        const introSeen = req.cookies.get("revibe_intro_seen")?.value;

        // If authenticated, redirect to home
        if (token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        // If intro not seen, redirect to splash
        if (!introSeen) {
            return NextResponse.redirect(new URL("/splash", req.url));
        }
    }

    // ...existing code for other routes if needed
    return NextResponse.next();
}

export const config = {
    matcher: ["/registration"],
};
