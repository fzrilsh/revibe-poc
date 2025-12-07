"use client";

import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { FaRegCommentAlt } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import { useState, useEffect } from "react";

interface Review {
    id: number;
    item_id: number;
    rating: number;
    repurchase: boolean | null;
    usage_period: string | null;
    content: string | null;
    created_at: string;
    like_count: number;
    comment_count: number;
    item: {
        name: string;
        brand: string;
        image_url: string | null;
    } | null;
    user: {
        nickname: string;
        image_url: string | null;
    } | null;
}

export function ReviewSection() {
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestReview = async () => {
            try {
                const res = await fetch("/api/reviews");
                if (res.ok) {
                    const json = await res.json();
                    const reviews = json.data?.reviews ?? [];
                    if (reviews.length > 0) {
                        setReview(reviews[0]); // Get latest review
                    }
                }
            } catch (err) {
                console.error("Error fetching reviews:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestReview();
    }, []);

    if (loading) {
        return (
            <div className="flex-start gap-3 flex-col w-full">
                <h2 className="font-semibold text-lg">Review from community</h2>
                <div className="text-center text-gray-500 py-4">Loading...</div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="flex-start gap-3 flex-col w-full">
                <h2 className="font-semibold text-lg">Review from community</h2>
                <div className="text-center text-gray-500 py-4">Product tidak tersedia</div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <div className="flex-start gap-3 flex-col w-full">
            <h2 className="font-semibold text-lg">Review from community</h2>
            <div className="space-y-4 w-full">
                <div className="bg-white rounded-2xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 relative">
                                <Image src={review.user?.image_url || "/community/profile/avatar1.svg"} alt={review.user?.nickname || "User"} fill className="object-cover" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-woodsmoke">{review.user?.nickname || "Anonymous"}</h3>
                                <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                            </div>
                        </div>
                        <span className="bg-[#FFD93D] text-black text-xs font-semibold px-3 py-1 rounded-full">Review</span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                            <h4 className="font-semibold text-woodsmoke">
                                {review.item?.brand && `${review.item.brand} `}
                                {review.item?.name || "Product"}
                            </h4>
                            {review.content && <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                    <IoMdStar key={i} className="text-[#FFD93D] text-lg" />
                                ))}
                            </div>
                            <div className="flex flex-col gap-2 text-xs text-gray-600">
                                {review.repurchase !== null && (
                                    <span>
                                        Repurchase: <strong>{review.repurchase ? "Yes" : "No"}</strong>
                                    </span>
                                )}
                                {review.usage_period && (
                                    <span>
                                        Usage period: <strong>{review.usage_period}</strong>
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 pt-2">
                                <button className="flex items-center gap-1 hover:text-red-500">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill={"none"} stroke="currentColor" strokeWidth="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>{" "}
                                    {review.like_count}
                                </button>
                                <button className="flex items-center gap-1 hover:text-blue-500">
                                    <FaRegCommentAlt /> {review.comment_count}
                                </button>
                            </div>
                        </div>
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                            {review.item?.image_url ? <Image src={review.item.image_url} alt={review.item.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
