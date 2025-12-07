"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { label: "Challenge", href: "/activity/challenge" },
    { label: "Goals", href: "/activity/goals" },
];

export function ActivityTabs() {
    const pathname = usePathname();

    return (
        <div className="fixed top-20 pt-4 left-0 right-0 bg-white w-full border-b border-gray-200 z-40">
            <div className="flex-center justify-around flex-row gap-8 px-6 pt-4">
                {tabs.map((t) => {
                    const active = pathname === t.href;
                    return (
                        <Link key={t.href} href={t.href} className={`relative pb-3 text-sm font-medium transition-colors ${active ? "text-black" : "text-gray-400 hover:text-gray-600"}`}>
                            {t.label}
                            {active && <span className="absolute left-0 right-0 -bottom-px w-full h-0.5 rounded bg-black" />}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}