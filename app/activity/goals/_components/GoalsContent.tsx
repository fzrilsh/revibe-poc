"use client";

import ProgressSection from "./sections/ProgressSection";
import StatsGrid from "./sections/StatsGrid";
import AddGoalsButton from "./sections/AddGoalsButton";

export default function GoalsContent() {
    return (
        <div className="mx-auto w-full pb-8">
            <ProgressSection />
            <StatsGrid />
            <AddGoalsButton />
        </div>
    );
}
