"use client";

import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import HistoryContent from "./_components/HistoryContent";
import NavigationHeader from "@features/NavigationHeader";

export default function HistoryPage() {
    return (
        <>
            <Header />
            <main className="pt-20 pb-24 min-h-screen h-full">
                <NavigationHeader className="px-4" title="History" onBack={() => window.history.back()} />
                <HistoryContent />
            </main>
            <Navbar />
        </>
    );
}
