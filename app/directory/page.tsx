"use client";

import Header from "@navigation/header";
import { DirectoryContent } from "./_components/DirectoryContent";
import Navbar from "@navigation/navbar";
import DirectoryHeader from "./_components/DirectoryHeader";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function DirectoryPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Initialize sortBy from URL param if it exists
    const getInitialSort = () => {
        const filterParam = searchParams?.get("filter");
        if (filterParam === "expiring") return "incoming";
        if (filterParam === "alpha") return "alpha";
        return "latest";
    };

    // Initialize categories from URL param if it exists
    const getInitialCategories = () => {
        const categoryParam = searchParams?.get("category");
        if (categoryParam) {
            // Normalize to titlecase (e.g., "skincare" -> "Skincare")
            const normalized = categoryParam.split(",").map((c) => {
                const trimmed = c.trim();
                return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            });
            return normalized;
        }
        return ["All"];
    };

    const [sortBy, setSortBy] = useState<string>(getInitialSort());
    const [activeCategories, setActiveCategories] = useState<string[]>(getInitialCategories());
    const categories = ["All", "Skincare", "Makeup", "Bodycare", "Haircare", "Fragrances", "Other"];

    // Sync URL with activeCategories state
    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString() ?? "");
        if (activeCategories.length > 0 && activeCategories[0] !== "All") {
            params.set("category", activeCategories.join(","));
        } else {
            params.delete("category");
        }
        const newUrl = `?${params.toString()}`;
        const currentUrl = `?${searchParams?.toString() ?? ""}`;
        if (newUrl !== currentUrl) {
            router.push(newUrl);
        }
    }, [activeCategories, router, searchParams]);

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
        setActiveCategories((prev) => {
            if (category === "All") {
                return ["All"];
            } else {
                const filtered = prev.filter((c) => c !== "All" && c !== category);
                if (prev.includes(category)) {
                    const newCategories = filtered;
                    return newCategories.length === 0 ? ["All"] : newCategories;
                } else {
                    return [...filtered, category];
                }
            }
        });
    };

    return (
        <>
            <Header />
            <DirectoryHeader sortBy={sortBy} setSortBy={updateSort} categories={categories} activeCategories={activeCategories} toggleCategory={toggleCategory} />
            <main className="pt-40 py-24 min-h-screen h-full">
                <DirectoryContent sortBy={sortBy} activeCategories={activeCategories} />
            </main>
            <Navbar />
        </>
    );
}

export default function DirectoryPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-gray-500">Loading...</p>
                </div>
            }
        >
            <DirectoryPageContent />
        </Suspense>
    );
}
