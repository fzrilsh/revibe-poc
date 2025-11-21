"use client";

import Image from "next/image";

export default function SplashPage() {
    return (
        <section className="flex-center h-screen overflow-hidden">
            <Image src={"/logo-revibe.svg"} height={"70"} width={"240"} alt="Revibe Logo" />
        </section>
    );
}
