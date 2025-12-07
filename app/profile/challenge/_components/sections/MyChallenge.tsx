"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTrophy } from "react-icons/fa6";

interface Challenge {
    id: string;
    title: string;
    days: number;
    participants: number;
    excerpt: string;
    image: string;
}

const mockChallenges: Challenge[] = [
    {
        id: "minimalist-30",
        title: "30 Days Minimalist Challenge",
        days: 30,
        participants: 53,
        excerpt: "Join the 30 days challenge to minimize your skincare usage and make the most of your beauty experience!",
        image: "/challenge/minimalist.svg",
    },
];

export default function MyChallenge() {
    const [challenges] = useState<Challenge[]>(mockChallenges);
    // const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     // Mock data initialization already handled in state
    //     setLoading(false);
    // }, []);

    // if (loading) {
    //     return <div className="text-center py-8">Loading challenges...</div>;
    // }

    return (
        <div className="space-y-4">
            {challenges.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No challenges yet</div>
            ) : (
                challenges.map((challenge) => (
                    <div key={challenge.id} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                        <div className="relative w-full h-32">
                            <Image src={challenge.image} alt={challenge.title} fill className="object-cover" />
                            <span className="absolute top-2 right-2 text-[10px] bg-black/70 text-white px-2 py-1 rounded-full flex-center flex-row gap-1">
                                <FaTrophy className="text-white" /> Get Badge
                            </span>
                        </div>

                        <div className="p-4 flex flex-col gap-2">
                            <span className="text-sm text-chetwode-blue font-medium">{challenge.participants}+ people have participated</span>
                            <h3 className="text-lg font-semibold leading-snug">{challenge.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{challenge.excerpt}</p>
                            <div className="pt-2">
                                <span className="inline-block rounded-full bg-black text-white text-xs px-4 py-2 font-medium group-active:scale-[.97] transition">View more</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
