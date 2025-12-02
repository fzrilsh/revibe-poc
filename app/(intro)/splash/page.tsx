"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SplashLogo } from "./_components/SplashLogo";
import { motion } from "motion/react";

const DISPLAY_TIME = 1800;
const EXIT_DURATION = 500;

const variants = {
    initial: { opacity: 0, scale: 0.95 },
    enter: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9, filter: "blur(4px)" },
};

export default function SplashPage() {
    const router = useRouter();
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        // If already authenticated, skip splash entirely
        const hasToken = document.cookie.split(";").some((c) => c.trim().startsWith("rv_token="));
        if (hasToken) {
            window.location.href = "/";
            return;
        }
        const showTimer = setTimeout(() => {
            setLeaving(true);
            // Push setelah animasi keluar selesai
            const navTimer = setTimeout(() => {
                // Mark intro seen with cookie so middleware can detect it
                document.cookie = "revibe_intro_seen=true; path=/; max-age=31536000"; // 1 year
                router.push("/opening");
            }, EXIT_DURATION);
            return () => clearTimeout(navTimer);
        }, DISPLAY_TIME);
        return () => clearTimeout(showTimer);
    }, [router]);

    return (
        <motion.section aria-busy={!leaving} className="flex-center h-screen overflow-hidden" initial="initial" animate={leaving ? "exit" : "enter"} variants={variants} transition={{ duration: leaving ? EXIT_DURATION / 1000 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <SplashLogo />
        </motion.section>
    );
}
