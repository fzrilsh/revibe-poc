import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to parse cookies
function getCookie(req: NextRequest, name: string) {
    const cookie = req.cookies.get(name);
    return cookie?.value ?? null;
}

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = getCookie(req, "rv_token");
    const introSeen = req.cookies.get("revibe_intro_seen")?.value;

    // Public routes that don't need authentication or intro check
    const publicRoutes = ["/splash", "/opening"];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    
    // Allow public routes without restrictions
    if (isPublicRoute) {
        // If already authenticated, redirect to home
        if (token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    // Registration pages - require intro seen
    if (pathname.startsWith("/registration")) {
        // If already authenticated, redirect to home
        if (token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        // If intro not seen, redirect to splash
        if (!introSeen) {
            return NextResponse.redirect(new URL("/splash", req.url));
        }
        return NextResponse.next();
    }

    // Onboarding pages - allow access even without full auth
    if (pathname.startsWith("/onboarding")) {
        return NextResponse.next();
    }

    // For all other pages (home, directory, feed, etc)
    // If authenticated, allow access
    if (token) {
        return NextResponse.next();
    }

    // Not authenticated - check if intro seen
    if (!introSeen) {
        return NextResponse.redirect(new URL("/splash", req.url));
    }

    // Intro seen but not authenticated - redirect to registration
    return NextResponse.redirect(new URL("/registration", req.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         * - manifest files (manifest.webmanifest, manifest.json)
         */
        "/((?!(?:api|_next/static|_next/image|favicon\\.ico|manifest\\.(?:webmanifest|json)|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$)).*)",
    ],
};
