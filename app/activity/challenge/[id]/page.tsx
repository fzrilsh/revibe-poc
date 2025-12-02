"use client";

import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import ChallengeDetailContent from "./_components/ChallengeDetailContent";
import React from "react";

export default function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params) as { id: string };
    return (
        <>
            <Header />
            <main className="pt-24 pb-24 min-h-screen">
                <ChallengeDetailContent id={id} />
            </main>
            <Navbar />
        </>
    );
}
