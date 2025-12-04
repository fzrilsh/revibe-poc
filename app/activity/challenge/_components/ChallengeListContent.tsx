"use client";

import ChallengeList from "./sections/ChallengeList";

interface ChallengeItem {
    id: string;
    title: string;
    days: number;
    participants: number;
    excerpt: string;
    image: string;
}

const challenges: ChallengeItem[] = [
    {
        id: "minimalist-30",
        title: "30 Days Minimalist Challenge",
        days: 30,
        participants: 53,
        excerpt: "Join the 30 days challenge to minimize your skincare usage and make the most of your beauty experience!",
        image: "/challenge/minimalist.svg",
    },
    {
        id: "skin-fasting-14",
        title: "14 Days Skin Fasting",
        days: 14,
        participants: 53,
        excerpt: "Have a break with your skin and come back with clearer skin than ever!",
        image: "/challenge/skin_fasting.svg",
    },
];

export default function ChallengeListContent() {
    return (
        <div className="max-w-md mx-auto px-6 pb-8">
            <ChallengeList challenges={challenges} />
        </div>
    );
}
