"use client";

import Image from "next/image";
import { LuBell } from "react-icons/lu";

export default function Header() {
    return (
        <header className="bg-fix flex-between py-6 px-6 z-50 bg-white">
            <span />
            <div className="relative max-w-32 w-32 h-10">
                <Image src={"/logo-revibe.svg"} fill alt="Revibe Logo" />
            </div>
            <div className="relative cursor-pointer" onClick={() => (window.location.href = "/history")}>
                <span className="absolute -top-0.5 right-0.5 w-2 h-2 bg-cerise-red rounded-full animate-pulse" />
                <LuBell className="text-2xl" />
            </div>
        </header>
    );
}
