"use client";

import { useState, ChangeEvent, useEffect } from "react";
import SearchBar from "./sections/SearchBar";
import ProductList from "./sections/ProductList";
import EmptyState from "./sections/EmptyState";

export interface ExpiringProduct {
    id: string;
    brand: string;
    name: string;
    expiredDate: string;
    daysLeft: number;
    image: string;
}

type ApiItem = {
    id: number | string;
    brand?: string | null;
    name?: string | null;
    image_url?: string | null;
    expiration_date?: string | null;
    status?: string | null;
};

export default function ExpirationContent() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<ExpiringProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch items and filter those expiring within 30 days
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/items", { cache: "no-store" });
                if (!res.ok) {
                    if (res.status === 401) {
                        setError("Please log in to view expiring products");
                    } else {
                        throw new Error("Failed to fetch items");
                    }
                    return;
                }
                const json = await res.json();
                const items = json?.data?.items ?? json?.items ?? [];

                const now = Date.now();
                const maxDays = 30;
                const maxMs = maxDays * 24 * 60 * 60 * 1000;

                // Filter and transform items expiring within 30 days
                const expiring: ExpiringProduct[] = items
                    .map((item: ApiItem) => {
                        if (!item.expiration_date) return null;
                        const expDate = new Date(item.expiration_date);
                        if (Number.isNaN(expDate.getTime())) return null;
                        const msLeft = expDate.getTime() - now;
                        // Only include if expiring in future and within 30 days
                        if (msLeft <= 0 || msLeft > maxMs) return null;
                        const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));

                        return {
                            id: String(item.id),
                            brand: item.brand || "Unknown",
                            name: item.name || "Unnamed Product",
                            expiredDate: expDate.toLocaleDateString("en-GB"), // dd/mm/yyyy
                            daysLeft,
                            image: item.image_url || "/products/placeholder.svg",
                        };
                    })
                    .filter((p): p is ExpiringProduct => p !== null);

                if (active) {
                    setProducts(expiring);
                    setError(null);
                }
            } catch (err) {
                console.error("Error fetching items:", err);
                if (active) {
                    setError("Failed to load expiring products");
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

    const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleMoveToHistory = async (id: string) => {
        try {
            // Move to history by setting status to "used-up" or "disposed"
            const formData = new FormData();
            formData.append("status", "used-up");
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to update item");
            // Remove from expiring list
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Error moving to history:", err);
            alert("Failed to move item to history");
        }
    };

    const handleSetReminder = async (id: string) => {
        try {
            // Set reminder_enabled to true and reminder_date to expiration_date
            const product = products.find((p) => p.id === id);
            if (!product) return;
            // Parse expiredDate back to ISO for API
            const [day, month, year] = product.expiredDate.split("/");
            const reminderDate = new Date(`${year}-${month}-${day}`);
            if (Number.isNaN(reminderDate.getTime())) {
                alert("Invalid expiration date");
                return;
            }

            const formData = new FormData();
            formData.append("reminder_enabled", "true");
            formData.append("reminder_date", reminderDate.toISOString());
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to set reminder");
            alert("Reminder set successfully!");
        } catch (err) {
            console.error("Error setting reminder:", err);
            alert("Failed to set reminder");
        }
    };

    if (loading) {
        return (
            <div className="max-w-md mx-auto px-4 pb-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">Loading expiring products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto px-4 pb-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 pb-8">
            <SearchBar search={search} onSearch={handleSearch} />

            {filtered.length > 0 ? <ProductList products={filtered} onMoveToHistory={handleMoveToHistory} onSetReminder={handleSetReminder} /> : <EmptyState />}
        </div>
    );
}
