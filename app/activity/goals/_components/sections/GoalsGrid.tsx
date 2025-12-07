"use client";

import Image from "next/image";

interface Goal {
    id: number;
    name: string;
    description: string;
    icon: string;
}

const goals: Goal[] = [
    {
        id: 1,
        name: "Fresh Start",
        description: "3 Day Streak",
        icon: "/goals/Illustration UI Revibe_Icon Goals 1.png",
    },
    {
        id: 2,
        name: "Glow Getter",
        description: "7 Day Streak",
        icon: "/goals/Illustration UI Revibe_Icon Goals 2.png",
    },
    {
        id: 3,
        name: "Habit Queen",
        description: "14 Day Streak",
        icon: "/goals/Illustration UI Revibe_Icon Goals 3.png",
    },
    {
        id: 4,
        name: "Minimalist Mover",
        description: "Completed 10 Days / Minimalist",
        icon: "/goals/Illustration UI Revibe_Icon Goals 4.png",
    },
    {
        id: 5,
        name: "Bare Beauty Champ",
        description: "Completed 10 Days / Skincare",
        icon: "/goals/Illustration UI Revibe_Icon Goals 5.png",
    },
    {
        id: 6,
        name: "Declutter Diva",
        description: "Decluttered 15 Products",
        icon: "/goals/Illustration UI Revibe_Icon Goals 6.png",
    },
    {
        id: 7,
        name: "Mindful Journey",
        description: "Added 10 Products In Community",
        icon: "/goals/Illustration UI Revibe_Icon Goals 7.png",
    },
    {
        id: 8,
        name: "No Waste Warrior",
        description: "Logged 10 Finished Products",
        icon: "/goals/Illustration UI Revibe_Icon Goals 8.png",
    },
    {
        id: 9,
        name: "Supportive Soul",
        description: "Commented on 15 Community Posts",
        icon: "/goals/Illustration UI Revibe_Icon Goals 9.png",
    },
];

export default function GoalsGrid() {
    return (
        <div className="px-6 pb-6 mt-8">
            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold mb-1">Explore Goals</h2>
                <p className="text-sm text-gray-500">(Coming Soon)</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {goals.map((goal) => (
                    <div key={goal.id} className="flex flex-col items-center rounded-xl bg-white text-center p-2 cursor-pointer group hover:opacity-80 transition">
                        <div className="w-20 h-20 mb-3 relative overflow-hidden flex items-center justify-center">
                            <Image src={goal.icon} alt={goal.name} width={80} height={80} className="object-contain" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">{goal.name}</h3>
                        <p className="text-[10px] text-gray-500">{goal.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
