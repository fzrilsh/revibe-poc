"use client";

import { useEffect, useMemo, useState } from "react";
import HistorySection from "./sections/HistorySection";
import { getNotifications, type DirectoryNotification } from "@/lib/notifications";

export interface HistoryItem {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    type: "added" | "expired" | "removed" | "edited";
    productImage?: string;
}

export default function HistoryContent() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            setLoading(true);
            
            // Read notifications from localStorage
            const notifications = getNotifications();
            
            // Transform notifications to history items
            const historyItems: HistoryItem[] = notifications.map((notif) => {
                const productInfo = `${notif.productBrand} ${notif.productName}`;
                let title = "";
                let description = "";
                let type: "added" | "expired" | "removed" | "edited" = "added";

                switch (notif.type) {
                    case "added":
                        title = "Product Added";
                        description = `"${productInfo}" was added to directory`;
                        type = "added";
                        break;
                    case "edited":
                        title = "Product Updated";
                        description = `"${productInfo}" information was updated`;
                        type = "edited";
                        break;
                    case "deleted":
                        title = "Product Removed";
                        description = `"${productInfo}" was removed from directory`;
                        type = "removed";
                        break;
                    case "expired":
                        title = "Product Expired";
                        description = `"${productInfo}" has expired`;
                        type = "expired";
                        break;
                }

                return {
                    id: notif.id,
                    title,
                    description,
                    createdAt: new Date(notif.timestamp),
                    type,
                    productImage: notif.productImage,
                };
            });

            setItems(historyItems);
        } catch (err) {
            console.error("Error loading history:", err);
        } finally {
            setLoading(false);
        }
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

    // if (error) {
    //     return (
    //         <div className="pt-4 px-6">
    //             <div className="text-red-500">{error}</div>
    //         </div>
    //     );
    // }

    return (
        <div className="pt-4 mx-auto">
            {newItems.length > 0 && <HistorySection title="New" items={newItems} />}
            {lastWeekItems.length > 0 && <HistorySection title="Last week" items={lastWeekItems} />}
            {newItems.length === 0 && lastWeekItems.length === 0 && <div className="px-6 text-gray-500 text-center">No history yet</div>}
        </div>
    );
}
