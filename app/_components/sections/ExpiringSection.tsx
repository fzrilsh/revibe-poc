"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ExpiringProduct {
    id: number;
    name: string;
    brand: string;
    image_url: string | null;
    expiration_date: string | null;
    daysLeft: number;
}

export function ExpiringSection() {
    const [expiringProducts, setExpiringProducts] = useState<ExpiringProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpiringProducts = async () => {
            try {
                const res = await fetch("/api/items");
                if (res.ok) {
                    const json = await res.json();
                    const items = json.data?.items ?? [];
                    
                    // Filter items with expiration date and calculate days left
                    const now = new Date();
                    const itemsWithExpiry = items
                        .filter((item: any) => item.expiration_date)
                        .map((item: any) => {
                            const expiryDate = new Date(item.expiration_date);
                            const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                            return {
                                id: item.id,
                                name: item.name || "Unknown Product",
                                brand: item.brand || "",
                                image_url: item.image_url,
                                expiration_date: item.expiration_date,
                                daysLeft,
                            };
                        })
                        .filter((item: ExpiringProduct) => item.daysLeft >= 0 && item.daysLeft <= 30)
                        .sort((a: ExpiringProduct, b: ExpiringProduct) => a.daysLeft - b.daysLeft)
                        .slice(0, 3); // Take top 3 closest to expiry

                    setExpiringProducts(itemsWithExpiry);
                }
            } catch (err) {
                console.error("Error fetching expiring products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExpiringProducts();
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-200 p-4 rounded-2xl w-full flex-center flex-col gap-4">
                <div className="text-center text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-200 p-4 rounded-2xl w-full flex-center flex-col gap-4">
            <div className="flex-between w-full">
                <h1 className="font-semibold flex items-center gap-2">
                    <span className="text-xl">⛔</span> Expiring Soon
                </h1>
                <Link href="/directory?filter=expiring" className="text-gray-500 text-sm hover:text-gray-700">
                    View All
                </Link>
            </div>

            <div className="flex-col w-full gap-3 flex-center">
                {expiringProducts.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">Product tidak tersedia</div>
                ) : (
                    expiringProducts.map((prod) => (
                    <Link href={`/directory/product/detail/${prod.id}`} key={prod.id} className="bg-white w-full rounded-xl p-3 flex-center flex-row gap-4 hover:bg-gray-50 transition">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                            {prod.image_url ? (
                                <Image src={prod.image_url} alt={prod.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                            )}
                        </div>
                        <div className="flex-1">
                            {prod.brand && <p className="text-xs text-gray-500">{prod.brand}</p>}
                            <h3 className="text-woodsmoke font-medium">{prod.name}</h3>
                        </div>
                        <span className={`text-white text-sm font-semibold px-4 py-2 rounded-full ${prod.daysLeft <= 7 ? "bg-[#F52664]" : "bg-orange-500"}`}>
                            {prod.daysLeft}d
                        </span>
                    </Link>
                    ))
                )}
            </div>
        </div>
    );
}
