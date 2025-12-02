"use client";

import { useState, TouchEvent } from "react";
import CircularProgress from "./CircularProgress";

interface ProgressCard {
    id: string;
    label: string;
    percentage: number;
}

const progressItems: ProgressCard[] = [
    { id: "challenge", label: "Challenge Finished", percentage: 15 },
    { id: "products", label: "Products Finished", percentage: 35 },
    { id: "challenge2", label: "Challenge Finished", percentage: 45 },
];

export default function ProgressSection() {
    const [activeIndex, setActiveIndex] = useState(() => Math.floor(progressItems.length / 2));
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const CARD_WIDTH = 180;
    const GAP = 16;

    const setContainerRef = (el: HTMLDivElement | null) => {
        if (el) {
            const width = el.getBoundingClientRect().width;
            if (width !== containerWidth) setContainerWidth(width);
        }
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? progressItems.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === progressItems.length - 1 ? 0 : prev + 1));
    };

    const handleTouchStart = (e: TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }
    };

    const totalShift = (containerWidth - CARD_WIDTH) / 2 - activeIndex * (CARD_WIDTH + GAP);

    return (
        <div className="bg-onboarding mb-6 py-10">
            <h2 className="text-center text-lg font-bold mb-6">Progress</h2>
            <div className="relative overflow-hidden w-full" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} ref={setContainerRef}>
                <div
                    className="flex items-center"
                    style={{
                        gap: GAP,
                        transform: `translateX(${isNaN(totalShift) ? 0 : totalShift}px)`,
                        transition: "transform 0.4s ease",
                        width: progressItems.length * (CARD_WIDTH + GAP) - GAP,
                    }}
                >
                    {progressItems.map((item, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <div
                                key={item.id}
                                onClick={() => {
                                    if (idx === activeIndex) {
                                        setActiveIndex((prev) => (prev + 1) % progressItems.length);
                                    } else {
                                        setActiveIndex(idx);
                                    }
                                }}
                                className={`shrink-0 bg-white rounded-3xl p-4 flex-center flex-col shadow-sm cursor-pointer transition-all duration-300 ${isActive ? "scale-100" : "scale-90 opacity-60"}`}
                                style={{ width: CARD_WIDTH }}
                            >
                                <CircularProgress percentage={item.percentage} />
                                <p className="text-lg font-semibold text-center mt-3 leading-tight">{item.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
