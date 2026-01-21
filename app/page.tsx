"use client";

import { useEffect, useState } from "react";
import { GreetingSection } from "./_components/sections/GreetingSection";
import { StatsSection } from "./_components/sections/StatsSection";
import { BannerSection } from "./_components/sections/BannerSection";
import { CategorySection } from "./_components/sections/CategorySection";
import { ChallengeSection } from "./_components/sections/ChallengeSection";
import { ExpiringSection } from "./_components/sections/ExpiringSection";
import { ReviewSection } from "./_components/sections/ReviewSection";

import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import type { UserPublic } from "@/features/auth/auth.types";
import { LuPlus } from "react-icons/lu";
import { useRouter } from "next/navigation";
import HomeModal from "@/components/shared/HomeModal";
type Item = {
    status?: string | null;
    item_status?: string | null;
    expires_at?: string | null;
    expiration_date?: string | null;
};

export default function Home() {
    const [user, setUser] = useState<UserPublic | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [itemsCount, setItemsCount] = useState(0);
    const [expireCount, setExpireCount] = useState(0);
    const [challengeCount, setChallengeCount] = useState(0);

    const [showHomeModal, setShowHomeModal] = useState(false);

    const router = useRouter();

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch("/api/auth/me", { cache: "no-store" });
                if (!res.ok) {
                    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                    router.push("/");
                    return;
                }
                const json = await res.json();
                const u = (json?.data?.user ?? json?.user) as UserPublic | undefined;
                if (active) setUser(u ?? null);
            } catch {
                // ignore
            } finally {
                if (active) setLoadingUser(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    // Fetch items to populate counts
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch("/api/items", { cache: "no-store" });
                if (!res.ok) {
                    // unauthenticated or error -> leave counts as 0
                    return;
                }
                const json = await res.json();
                const items = (json?.data?.items ?? json?.items ?? []) as Item[];
                if (!Array.isArray(items)) return;
                if (active) {
                    setItemsCount(items.length);
                    // naive expiring detection: status === 'expiring' or expires_at within 30 days if present
                    const now = Date.now();
                    const in30 = 30 * 24 * 60 * 60 * 1000;
                    const expCount = items.filter((it) => {
                        const status = (it.status ?? it.item_status ?? "").toLowerCase();
                        if (status === "expiring") return true;
                        const expiresAt = it.expires_at ?? it.expiration_date ?? null;
                        if (!expiresAt) return false;
                        const t = new Date(expiresAt).getTime();
                        return !Number.isNaN(t) && t - now <= in30 && t > now;
                    }).length;
                    setExpireCount(expCount);
                    
                    // Count joined challenges from localStorage
                    if (typeof window !== "undefined") {
                        let joinedCount = 0;
                        for (let i = 0; i < localStorage.length; i++) {
                            const key = localStorage.key(i);
                            if (key?.startsWith("challenge_joined_") && localStorage.getItem(key) === "true") {
                                joinedCount++;
                            }
                        }
                        setChallengeCount(joinedCount);
                    }
                }
            } catch {
                // ignore
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const onAddProduct = () => {
        setShowHomeModal(true);
    };

    return (
        <>
            <Header />
            <main className="flex-center justify-start w-full min-h-screen flex-col py-26 px-5">
                <GreetingSection user={user} loading={loadingUser} />
                <StatsSection itemsCount={itemsCount} expireCount={expireCount} challengeCount={challengeCount} />
                <BannerSection />
                <CategorySection />
                <ChallengeSection />
                <ExpiringSection />
                <ReviewSection />

                <button onClick={onAddProduct} className="fixed z-99 right-10 bottom-24 bg-black p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors">
                    <LuPlus className="text-2xl text-white" />
                </button>
            </main>
            <HomeModal
                isOpen={showHomeModal}
                onClose={() => {
                    setShowHomeModal(false);
                }}
            />
            <Navbar />
        </>
    );
}
