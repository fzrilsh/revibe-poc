"use client";

import Header from "@navigation/header";
import { DirectoryContent } from "./_components/DirectoryContent";
import Navbar from "@navigation/navbar";
import DirectoryHeader from "./_components/DirectoryHeader";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function DirectoryPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Initialize sortBy from URL param if it exists
    const getInitialSort = () => {
        const filterParam = searchParams?.get("filter");
        if (filterParam === "expiring") return "incoming";
        if (filterParam === "alpha") return "alpha";
        return "latest";
    };

    const [sortBy, setSortBy] = useState<string>(getInitialSort());
    const [activeCategories, setActiveCategories] = useState<string[]>(["All"]);

    const updateSort = (newSort: string) => {
        setSortBy(newSort);
        // Map to URL param: 'incoming' -> 'expiring', others stay same
        const filterParam = newSort === "incoming" ? "expiring" : newSort === "latest" ? "" : newSort;
        const params = new URLSearchParams(searchParams?.toString() ?? "");
        if (filterParam) {
            params.set("filter", filterParam);
        } else {
            params.delete("filter");
        }
        router.push(`?${params.toString()}`);
    };

    const toggleCategory = (category: string) => {
        setActiveCategories((prev) => (category === "All" ? ["All"] : prev.includes(category) ? prev.filter((c) => c !== "All" && c !== category) : [...prev.filter((c) => c !== "All"), category]));
    };

    return (
        <>
            <Header />
            <DirectoryHeader sortBy={sortBy} setSortBy={updateSort} activeCategories={activeCategories} toggleCategory={toggleCategory} />
            <main className="pt-40 py-24 min-h-screen h-full">
                <DirectoryContent sortBy={sortBy} activeCategories={activeCategories} />
            </main>
            <Navbar />
        </>
    );
}
