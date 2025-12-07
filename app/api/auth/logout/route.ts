import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.redirect(new URL("/", "http://localhost"));
    res.headers.append("Set-Cookie", "rv_token=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0");
    res.headers.append("Set-Cookie", "revibe_intro_seen=; Path=/; Max-Age=0");
    return new Response(null, {
        status: 204,
        headers: res.headers,
    });
}