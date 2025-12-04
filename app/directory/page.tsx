"use client";

import Header from "@navigation/header";
import { DirectoryTabs } from "@features/DirectoryTabs";
import { DirectoryContent } from "./_components/DirectoryContent";
import Navbar from "@navigation/navbar";

export default function DirectoryPage() {
    return (
        <>
            <Header />
            <DirectoryTabs />
            <main className="pt-40 py-24 min-h-screen h-full">
                <DirectoryContent />
            </main>
            <Navbar />
        </>
    );
}
