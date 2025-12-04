"use client";

import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import NavigationHeader from "@features/NavigationHeader";

interface DirectoryItem {
    id: number;
    brand?: string | null;
    name?: string | null;
    category?: string | null;
    image_url?: StaticImageData | string | null;
}

interface ReviewFormState {
    rating: number | null;
    thoughts: string;
    repurchase: string; // Yes / No / Not sure
    usagePeriod: string; // 1 week, 2 weeks, 1 month ...
}

const usageOptions = ["1 week", "2 weeks", "1 month", "3 months", "6 months", "1 year"];
const repurchaseOptions = ["Yes", "No", "Not sure"];

export default function ReviewAddPage() {
    const [items, setItems] = useState<DirectoryItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<DirectoryItem | null>(null);
    const [form, setForm] = useState<ReviewFormState>({ rating: null, thoughts: "", repurchase: "", usagePeriod: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch(`/api/items`);
                if (!res.ok) throw new Error(`Failed to load items`);
                const data = await res.json();
                const rows: DirectoryItem[] = data?.data?.items ?? [];
                if (mounted) setItems(rows);
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoadingItems(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const resetToList = () => {
        setSelectedProduct(null);
        setForm({ rating: null, thoughts: "", repurchase: "", usagePeriod: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || !form.rating || !form.thoughts || !form.repurchase || !form.usagePeriod) return;
        setSubmitting(true);

        const repurchaseValue = form.repurchase === "Yes" ? true : form.repurchase === "No" ? false : null;
        try {
            const res = await fetch(`/api/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    item_id: selectedProduct.id,
                    rating: form.rating,
                    repurchase: repurchaseValue,
                    usage_period: form.usagePeriod,
                    content: form.thoughts,
                }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message || "Failed to submit review");
            }
            resetToList();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <main className="pt-28 pb-24 min-h-screen h-full px-4">
                {/* Header Row */}
                <NavigationHeader title="Create Review" />

                {!selectedProduct && (
                    <>
                        <p className="text-base mb-4 text-gray-600 text-center">Select product from your directory</p>
                        {loadingItems ? (
                            <div className="text-xs text-gray-500">Loading…</div>
                        ) : (
                            <div className="space-y-3">
                                {items.length === 0 && <div className="text-xs text-gray-500">No items in your directory yet.</div>}
                                {items.map((p) => (
                                    <button key={p.id} onClick={() => setSelectedProduct(p)} className="w-full flex gap-4 items-center bg-white rounded-2xl px-4 py-3 text-left shadow-sm active:scale-[.98] transition border border-gray-100">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {p.image_url ? <Image src={p.image_url} alt={p.name ?? "Product"} width={64} height={64} className="object-cover w-full h-full" /> : <div className="w-full h-full bg-gray-200" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm leading-tight">{p.brand ?? "Unnamed Brand"}</p>
                                            <p className="text-xs text-gray-700 leading-tight">{p.name ?? "Unnamed Product"}</p>
                                            <p className="text-xs text-gray-400 mt-1">{p.category ?? "Uncategorized"}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {selectedProduct && (
                    <form onSubmit={handleSubmit} className="space-y-6 mt-2">
                        {/* Selected Product Card */}
                        <div className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                                {selectedProduct.image_url ? <Image src={selectedProduct.image_url} alt={selectedProduct.name ?? "Product"} width={80} height={80} className="object-cover w-full h-full" /> : <div className="w-full h-full bg-gray-100" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm leading-tight">{selectedProduct.brand ?? "Unnamed Brand"}</p>
                                <p className="text-xs text-gray-700 leading-tight">{selectedProduct.name ?? "Unnamed Product"}</p>
                                <p className="text-xs text-gray-400 mt-1">{selectedProduct.category ?? "Uncategorized"}</p>
                            </div>
                        </div>

                        {/* Rate this product */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold flex items-center gap-1">✨ Rate this product</label>
                            <div className="bg-white rounded-full px-4 py-2 border border-gray-200 flex items-center justify-between">
                                <span className="text-xs text-gray-500">Give your rating</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button type="button" key={star} onClick={() => setForm((f) => ({ ...f, rating: star }))} className="text-xl" aria-label={`Rate ${star}`}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill={form.rating && form.rating >= star ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Thoughts */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold flex items-center gap-1">🖊️ What do you think of this product?</label>
                            <textarea
                                value={form.thoughts}
                                onChange={(e) => setForm((f) => ({ ...f, thoughts: e.target.value }))}
                                className="w-full bg-white px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm min-h-[110px] placeholder:text-gray-400"
                                placeholder="Share your thoughts about this product. Describe that little thing you like or dislike about it, was it the packaging, texture, or something else?"
                            />
                        </div>

                        {/* Repurchase */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold flex items-center gap-1">🛍️ Would you repurchase this product?</label>
                            <div className="bg-white rounded-full px-4 py-2 border border-gray-200 flex items-center justify-between">
                                <select value={form.repurchase} onChange={(e) => setForm((f) => ({ ...f, repurchase: e.target.value }))} className="bg-transparent text-xs flex-1 focus:outline-none">
                                    <option value="" disabled>
                                        Select option
                                    </option>
                                    {repurchaseOptions.map((o) => (
                                        <option key={o} value={o}>
                                            {o}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Usage Period */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold flex items-center gap-1">🕒 How long have you used this product?</label>
                            <div className="bg-white rounded-full px-4 py-2 border border-gray-200 flex items-center justify-between">
                                <select value={form.usagePeriod} onChange={(e) => setForm((f) => ({ ...f, usagePeriod: e.target.value }))} className="bg-transparent text-xs flex-1 focus:outline-none">
                                    <option value="" disabled>
                                        Select option
                                    </option>
                                    {usageOptions.map((o) => (
                                        <option key={o} value={o}>
                                            {o}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || !form.rating || !form.thoughts || !form.repurchase || !form.usagePeriod}
                            className="w-full bg-black text-white mt-4 py-3 rounded-full font-semibold hover:bg-gray-800 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {submitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                )}
            </main>
            <Navbar />
        </>
    );
}
