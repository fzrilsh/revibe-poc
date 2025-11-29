"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Cek apakah user sudah pernah melihat intro
        const hasSeenIntro = localStorage.getItem("revibe_intro_seen");

        if (!hasSeenIntro) {
            // Belum pernah lihat intro, redirect ke splash
            router.push("/splash");
        } else {
            // Sudah pernah lihat intro, redirect ke home
            router.push("/");
        }
    }, [router]);

    return <>
        <h1>Bisa</h1>
    </>;
}
