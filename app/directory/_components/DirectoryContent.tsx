"use client";

import { useState, useEffect, useMemo } from "react";
import { EmptyState } from "./sections/EmptyState";
import { ProductList } from "./sections/ProductList";

interface DirectoryContentProps {
    sortBy: string;
    activeCategories: string[];
}

interface Product {
    id: string;
    brand: string;
    name: string;
    type: string;
    category: string;
    image: string;
    rating?: number;
    purchaseDate: string;
    expirationDate: string;
    isNew?: boolean;
    daysLeft: number;
}

interface ApiItem {
    id: number;
    brand?: string | null;
    name?: string | null;
    category?: string | null;
    image_url?: string | null;
    rating?: number | null;
    isNew?: boolean;
    daysLeft: number;
    created_at?: string | null;
}

export function DirectoryContent({ sortBy, activeCategories }: DirectoryContentProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadItems = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/items");

                if (res.status === 401) {
                    // User not authenticated - show empty state instead of error
                    setProducts([]);
                    setError(null);
                    setLoading(false);
                    return;
                }

                if (!res.ok) {
                    throw new Error("Failed to fetch items");
                }
                const json = await res.json();
                const items = json.data?.items || [];

                // Transform items to Product format

                const transformed: Product[] = items.map((item: ApiItem) => {
                    const createdAt = item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString();

                    const daysLeft = item.created_at ? Math.max(0, Math.floor((new Date(item.created_at).getTime() + 7 * 86400000 - Date.now()) / 86400000)) : 0;

                    return {
                        id: String(item.id),
                        brand: item.brand || "Unknown Brand",
                        name: item.name || "Unnamed Product",
                        type: item.category || "Uncategorized",
                        category: item.category || "Uncategorized",
                        image: item.image_url || "/products/placeholder.svg",
                        rating: item.rating || undefined,
                        purchaseDate: createdAt,
                        expirationDate: createdAt,
                        isNew: item.created_at ? Date.now() - new Date(item.created_at).getTime() < 7 * 86400000 : false,
                        daysLeft,
                    };
                });

                setProducts(transformed);
                setError(null);
            } catch (err) {
                console.error("Error fetching items:", err);
                setError("Failed to load items");
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, []);

    const filtered = useMemo(() => {
        const base = activeCategories.includes("All") || activeCategories.length === 0 ? products : products.filter((p: Product) => activeCategories.includes(p.category));
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
            <div className="max-w-md mx-auto px-6 h-full w-full flex items-center justify-center">
                <div className="text-center text-gray-500">Loading items...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto px-6 h-full w-full flex items-center justify-center">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return <div className="max-w-md mx-auto px-6 h-full w-full flex-center flex-col gap-4 mt-10">{filtered.length === 0 ? <EmptyState /> : <ProductList products={filtered} />}</div>;
}
