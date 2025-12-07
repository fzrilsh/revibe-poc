"use client";

import { useState } from "react";
import { LuSlidersHorizontal } from "react-icons/lu";
import { LuChevronDown } from "react-icons/lu";

interface SortSelectProps {
    sortBy: string;
    onChangeSort: (value: string) => void;
}

const SORT_OPTIONS = [
    { value: "latest", label: "Latest purchase" },
    { value: "incoming", label: "Incoming expiration date" },
    { value: "alpha", label: "Alphabetical" },
];

export default function SortSelect({ sortBy, onChangeSort }: SortSelectProps) {
    const [open, setOpen] = useState(false);

    const selectedLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Select";

    return (
        <div className="relative w-full max-w-full">
            {/* Input “Sort by” style */}
            <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between border border-gray-300 bg-white px-4 py-2.5 rounded-full hover:border-gray-400 transition">
                <div className="flex items-center gap-2">
                    <LuSlidersHorizontal className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{selectedLabel}</span>
                </div>
                <LuChevronDown className={`h-5 w-5 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Floating */}
            {open && (
                <div className="absolute mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-30">
                    {SORT_OPTIONS.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => {
                                onChangeSort(item.value);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-gray-100 rounded-md transition ${sortBy === item.value ? "font-medium text-black" : "text-gray-700"}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
