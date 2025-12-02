"use client";

import { useState, useEffect } from "react";
import { CategoryFilter } from "./sections/CategoryFilter";
import { EmptyState } from "./sections/EmptyState";
import { ProductList } from "./sections/ProductList";

interface Product {
    id: string;
    brand: string;
    name: string;
    type: string;
    category: string;
    image: string;
    rating?: number;
}

export function DirectoryContent() {
    const [category, setCategory] = useState<string>("");
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
                const transformed: Product[] = items.map((item: any) => ({
                    id: String(item.id),
                    brand: item.brand || "Unknown Brand",
                    name: item.name || "Unnamed Product",
                    type: item.category || "Uncategorized",
                    category: "Skincare", // Default category
                    image: item.image_url || "/products/placeholder.svg",
                    rating: item.rating || undefined,
                }));
                
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

    const filteredProducts = products.filter((p) => !category || category === "All" || p.category === category);

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

    return (
        <div className="max-w-md mx-auto px-6 h-full w-full flex-center flex-col gap-4">
            <CategoryFilter category={category} onCategoryChange={setCategory} />

            {filteredProducts.length === 0 ? <EmptyState /> : <ProductList products={filteredProducts} />}
        </div>
    );
}
