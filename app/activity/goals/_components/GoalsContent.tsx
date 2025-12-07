"use client";

import { useState } from "react";
import ProgressSection from "./sections/ProgressSection";
import StatsGrid from "./sections/StatsGrid";
import GoalsGrid from "./sections/GoalsGrid";
import AddGoalsButton from "./sections/AddGoalsButton";
import { ActivityTabs } from "@/components/features/ActivityTabs";

export default function GoalsContent() {
    return (
        <div className="mx-auto w-full pb-8">
            {/* Tab Navigation */}
            <ActivityTabs />

            <>
                <GoalsGrid />
            </>
        </div>
    );
}
