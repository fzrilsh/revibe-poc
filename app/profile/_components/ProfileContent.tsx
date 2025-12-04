"use client";
import { useState, useEffect } from "react";
import IdentityCard from "./sections/IdentityCard";
import JourneyCard from "./sections/JourneyCard";

interface UserData {
    id: string;
    nickname: string;
    birth_year: number;
    profile_image: string;
    skin_type: string;
    created_at: string;
    skin_concerns: Array<{ id: number; name: string }>;
    onboarding_answers: Array<{ question_text: string; answer: string }>;
}

function skinTypeToLabel(skinType: string): string {
    switch (skinType) {
        case "OILY":
            return "Oily Skin";
        case "DRY":
            return "Dry Skin";
        case "COMBINATION":
            return "Combination Skin";
        case "SENSITIVE":
            return "Sensitive Skin";
        case "NORMAL":
            return "Normal Skin";
        default:
            return "Skin Type";
    }
}

export default function ProfileContent() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ products: 0, reviews: 0, challenge: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, itemsRes, reviewsRes] = await Promise.all([
                    fetch("/api/auth/me"),
                    fetch("/api/items"),
                    fetch("/api/reviews"),
                ]);

                if (userRes.ok) {
                    const userJson = await userRes.json();
                    setUser(userJson.data?.user ?? null);
                }

                let productCount = 0;
                let reviewCount = 0;

                if (itemsRes.ok) {
                    const itemsJson = await itemsRes.json();
                    productCount = itemsJson.data?.items?.length ?? 0;
                }

                if (reviewsRes.ok) {
                    const reviewsJson = await reviewsRes.json();
                    reviewCount = reviewsJson.data?.reviews?.length ?? 0;
                }

                setStats({ products: productCount, reviews: reviewCount, challenge: 0 });
            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">User not found</p>
            </div>
        );
    }

    const skinTypes = [
        { label: skinTypeToLabel(user.skin_type), active: true },
        ...user.skin_concerns.slice(0, 2).map((c) => ({ label: c.name, active: true })),
    ];

    const journey = {
        directory: 60,
        budget: 30,
        goals: 87,
        badges: ["Badge 1", "Badge 2", "Badge 3"],
    };

    return (
        <div className="space-y-6">
            <IdentityCard name={user.nickname} image={user.profile_image || "/community/profile/avatar1.svg"} role="Beauty Enthusiast" skinTypes={skinTypes} stats={stats} />
            <JourneyCard directory={journey.directory} budget={journey.budget} goals={journey.goals} badges={journey.badges} />
        </div>
    );
}
