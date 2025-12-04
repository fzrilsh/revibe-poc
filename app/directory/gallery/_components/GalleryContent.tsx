"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { FiFilter } from "react-icons/fi";
import FilterPanel from "./sections/FilterPanel";
import CategoryChips from "./sections/CategoryChips";
import GalleryGrid from "./sections/GalleryGrid";

export interface ProductItem {
    id: string;
    brand: string;
    name: string;
    category: string;
    image: string;
    isNew?: boolean;
    purchaseDate: string; // ISO date for sort
    expirationDate: string; // ISO date for sort
}

const categories = ["Skincare", "Makeup", "Bodycare", "Haircare", "Fragrances"];

type ApiItem = {
    id: number | string;
    brand?: string | null;
    name?: string | null;
    category?: string | null;
    image_url?: string | null;
    created_at?: string | null;
    expiration_date?: string | null;
};

export default function GalleryContent() {
    const [activeCategories, setActiveCategories] = useState<string[]>(["Skincare", "Makeup", "Bodycare"]);
    const [sortBy, setSortBy] = useState<string>("latest");
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef<HTMLDivElement | null>(null);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch items from API
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/items", { cache: "no-store" });
                if (!res.ok) {
                    if (res.status === 401) {
                        setError("Please log in to view your products");
                    } else {
                        throw new Error("Failed to fetch items");
                    }
                    return;
                }
                const json = await res.json();
                const items = json?.data?.items ?? json?.items ?? [];
                
                // Transform API items to ProductItem
                const transformed: ProductItem[] = items.map((item: ApiItem) => {
                    const createdAt = item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString();
                    const expiresAt = item.expiration_date ? new Date(item.expiration_date).toISOString() : new Date(Date.now() + 365 * 86400000).toISOString();
                    
                    // Check if new (created within last 7 days)
                    const isNew = item.created_at ? (Date.now() - new Date(item.created_at).getTime()) < 7 * 86400000 : false;
                    
                    return {
                        id: String(item.id),
                        brand: item.brand || "Unknown",
                        name: item.name || "Unnamed Product",
                        category: item.category || "Skincare",
                        image: item.image_url || "/products/placeholder.svg",
                        isNew,
                        purchaseDate: createdAt,
                        expirationDate: expiresAt,
                    };
                });
                
                if (active) {
                    setProducts(transformed);
                    setError(null);
                }
            } catch (err) {
                console.error("Error fetching items:", err);
                if (active) {
                    setError("Failed to load products");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    // Close filter when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (showFilter && filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setShowFilter(false);
            }
        };
        window.addEventListener("mousedown", handler);
        return () => window.removeEventListener("mousedown", handler);
    }, [showFilter]);

    const toggleCategory = (cat: string) => {
        setActiveCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
    };

    const filtered = useMemo(() => {
        const base = activeCategories.length === 0 ? products : products.filter((p: ProductItem) => activeCategories.includes(p.category));
        switch (sortBy) {
            case "latest":
                return [...base].sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));
            case "incoming":
                return [...base].sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));
            case "alpha":
                return [...base].sort((a, b) => a.name.localeCompare(b.name));
            default:
                return base;
        }
    }, [activeCategories, sortBy, products]);

    if (loading) {
        return (
            <div className="max-w-md mx-auto px-4 pb-32 flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto px-4 pb-32 flex items-center justify-center min-h-[400px]">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 pb-32 relative">
            {/* Chips + filter toggle */}
            <div className="relative mb-4" ref={filterRef}>
                <div className="flex items-center gap-3 max-w-md w-full">
                    <button
                        aria-label="Toggle filters"
                        onClick={() => setShowFilter((s) => !s)}
                        className={`shrink-0 flex items-center justify-center rounded-full border px-3 py-2 text-xs font-medium transition ${showFilter ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                    >
                        <FiFilter className="text-sm" />
                    </button>
                    <div className="overflow-x-auto scrollbar-hide">
                        <CategoryChips categories={categories} active={activeCategories} onToggle={toggleCategory} />
                    </div>
                </div>
                {showFilter && (
                    <div className="absolute left-0 top-full mt-3 w-64 bg-white border border-gray-200 rounded-xl p-4 z-50 animate-fade-in">
                        <FilterPanel
                            sortBy={sortBy}
                            onChangeSort={(v) => {
                                setSortBy(v);
                                setShowFilter(false);
                            }}
                        />
                    </div>
                )}
            </div>

            <GalleryGrid products={filtered} />
        </div>
    );
}
