"use client";

import { useEffect, useMemo, useState } from "react";
import HistorySection from "./sections/HistorySection";

export interface HistoryItem {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    type: "added" | "expired" | "removed";
}

type ApiItem = {
    id: number | string;
    brand?: string | null;
    name?: string | null;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    expiration_date?: string | null;
};

export default function HistoryContent() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/items", { cache: "no-store" });
                if (!res.ok) {
                    if (res.status === 401) {
                        setError("Please log in to view history");
                    } else {
                        throw new Error("Failed to fetch items");
                    }
                    return;
                }
                const json = await res.json();
                const raw: ApiItem[] = (json?.data?.items ?? json?.items ?? []) as ApiItem[];

                // Consider items with status used-up/disposed as history (moved out from active library)
                const history = raw
                    .filter((it) => {
                        const s = (it.status ?? "").toLowerCase();
                        return s === "used-up" || s === "disposed" || s === "archived";
                    })
                    .map<HistoryItem>((it) => {
                        const whenStr = it.updated_at ?? it.created_at ?? new Date().toISOString();
                        const when = new Date(whenStr);
                        const brand = it.brand?.trim() || "Unknown";
                        const name = it.name?.trim() || "Unnamed Product";
                        const title = "Moved to history";
                        const description = `"${brand} ${name}" was moved to history`;
                        return {
                            id: String(it.id),
                            title,
                            description,
                            createdAt: when,
                            type: "removed",
                        };
                    })
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                if (active) {
                    setItems(history);
                    setError(null);
                }
            } catch (err) {
                console.error("Error loading history:", err);
                if (active) setError("Failed to load history");
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    const { newItems, lastWeekItems } = useMemo(() => {
        const today = new Date();
        const n = items.filter((i) => isSameDay(i.createdAt, today));
        const lw = items.filter((i) => !isSameDay(i.createdAt, today));
        return { newItems: n, lastWeekItems: lw };
    }, [items]);

    if (loading) {
        return (
            <div className="pt-4 px-6 mx-auto">
                <div className="text-gray-500">Loading history...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-4 px-6">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="pt-4 mx-auto">
            {newItems.length > 0 && <HistorySection title="New" items={newItems} />}
            {lastWeekItems.length > 0 && <HistorySection title="Last week" items={lastWeekItems} />}
            {newItems.length === 0 && lastWeekItems.length === 0 && <div className="px-6 text-gray-500 text-center">No history yet</div>}
        </div>
    );
}
