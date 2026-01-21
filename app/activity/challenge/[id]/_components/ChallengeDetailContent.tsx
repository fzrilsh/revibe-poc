"use client";

import { useEffect, useState } from "react";
import NavigationHeader from "./sections/NavigationHeader";
import ChallengeImage from "./sections/ChallengeImage";
import ChallengeInfo from "./sections/ChallengeInfo";
import ChallengeTips from "./sections/ChallengeTips";
import JoinButton from "./sections/JoinButton";
import ChallengeJoinModal from "./sections/ChallengeJoinModal";

interface ChallengeDetailProps {
    id: string;
}

type ChallengeInfo = {
    title: string;
    participants: number;
    image: string;
    description: string;
    tips: string[];
};

const challengeDetails: Record<string, ChallengeInfo> = {
    "minimalist-30": {
        title: "30 Days Minimalist Challenge",
        participants: 53,
        image: "/challenge/minimalist.svg",
        description:
            "Simplify your routine and reconnect with what truly matters. For the next 30 days, focus on using only the essentials – the products your skin actually needs. This challenge helps you clear out the clutter, reduce overconsumption, and find calm in a more intentional beauty rhythm.",
        tips: ["Start small. Focus on one category first.", "Use what you have. Finish what's already open.", "Track progress. Note small changes weekly.", "Reflect often. Keep what truly works.", "Celebrate less. Simplicity is success."],
    },
    "skin-fasting-14": {
        title: "14 Days Skin Fasting",
        participants: 53,
        image: "/challenge/skin_fasting.svg",
        description: "Give your skin a break so it can reset to its natural balance. For 14 days, reduce product layers and observe how your skin behaves. This helps you identify what is truly essential and what may be overwhelming your routine.",
        tips: ["Cut back gradually – not all at once.", "Keep a journal of daily skin changes.", "Stay hydrated and protect with sunscreen.", "Avoid adding new actives during the reset.", "Resume products slowly after fasting."],
    },
};

export default function ChallengeDetailContent({ id }: ChallengeDetailProps) {
    const detail = challengeDetails[id];
    const [joined, setJoined] = useState(false);
    const [participants, setParticipants] = useState(detail ? detail.participants : 0);

    // Hydrate join status from localStorage (per challenge)
    useEffect(() => {
        if (!detail) return;
        const key = `challenge_joined_${id}`;
        const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
        if (stored === "true") {
            setJoined(true);
            setParticipants(detail.participants + 1);
        }
    }, [detail, id]);
    const [showModal, setShowModal] = useState(false);

    if (!detail) return <p className="px-4 py-10 text-center text-sm text-gray-500">Challenge not found.</p>;

    const handleJoin = () => {
        if (joined) return; // Prevent double join
        setJoined(true);
        setParticipants((prev) => prev + 1);
        const key = `challenge_joined_${id}`;
        if (typeof window !== "undefined") {
            localStorage.setItem(key, "true");
        }
        setShowModal(true);
    };

    return (
        <div className="w-full max-w-md mx-auto px-4 pb-20">
            <NavigationHeader />
            <ChallengeImage image={detail.image} title={detail.title} />
            <ChallengeInfo title={detail.title} participants={participants} description={detail.description} />
            <ChallengeTips tips={detail.tips} />
            <JoinButton joined={joined} onJoin={handleJoin} />
            <ChallengeJoinModal open={showModal} onClose={() => setShowModal(false)} title={detail.title} image={detail.image} />
        </div>
    );
}
