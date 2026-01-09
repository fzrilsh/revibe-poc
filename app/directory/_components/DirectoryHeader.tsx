"use client";

import CategoryChips from "./sections/CategoryChips";
import FilterPanel from "./sections/FilterPanel";

interface DirectoryHeaderProps {
    sortBy: string;
    setSortBy: (v: string) => void;
    activeCategories: string[];
    toggleCategory: (category: string) => void;
    categories: string[];
}

export default function DirectoryHeader({ sortBy, setSortBy, activeCategories, toggleCategory, categories }: DirectoryHeaderProps) {
    return (
        <div className="fixed top-20 pb-2 left-0 right-0 bg-white border-b border-gray-200 z-40">
            <div className="flex-center gap-4 px-6 pt-4 w-full">
                <FilterPanel
                    sortBy={sortBy}
                    onChangeSort={(v) => setSortBy(v)}
                />
                <CategoryChips categories={categories} active={activeCategories} onToggle={toggleCategory} />
            </div>
        </div>
    );
}
