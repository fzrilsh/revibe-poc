"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Review {
    id: number;
    item_id: number;
    rating: number;
    content: string | null;
    repurchase: boolean | null;
    usage_period: string | null;
    created_at: string;
    comment_count: number;
    like_count: number;
    item: {
        name: string;
        brand: string;
        image_url: string | null;
    } | null;
    user: {
        nickname?: string;
        image_url?: string;
    } | null;
}

export default function MyReview() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current user first
                const userRes = await fetch("/api/auth/me");
                if (!userRes.ok) {
                    console.error("Not authenticated");
                    setLoading(false);
                    return;
                }
                const userData = await userRes.json();
                const currentUser = userData.data?.user;

                // Fetch all reviews
                const reviewsRes = await fetch("/api/reviews");
                if (reviewsRes.ok) {
                    const json = await reviewsRes.json();
                    const allReviews = json.data?.reviews ?? [];

                    // Filter reviews where the item owner matches current user
                    const myReviews = allReviews.filter((review: Review) => {
                        return review.user?.nickname === currentUser?.nickname;
                    });

                    setReviews(myReviews);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading reviews...</div>;
    }

    return (
        <div className="space-y-4">
            {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No reviews yet</div>
            ) : (
                reviews.map((review) => (
                    <article key={review.id} className="bg-white overflow-hidden shadow-sm">
                        <Link href={`/feed/community/review/${review.id}`} className="block">
                            <div className="flex items-start justify-between p-4 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0">
                                        <Image src={review.user?.image_url || ""} alt={review.user?.nickname || ""} width={40} height={40} className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm leading-tight">{review.user?.nickname}</h3>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{review.created_at}</p>
                                    </div>
                                </div>
                                {review && <span className={`bg-bright-sun text-white text-xs font-medium px-3 py-1 rounded-full`}>Review</span>}
                            </div>

                            <div className="px-4 pb-2">
                                <h4 className="font-bold text-sm">{review.item?.name}</h4>
                            </div>

                            {review.rating !== undefined && (
                                <div className="px-4 pb-2 flex items-center">
                                    {Array.from({ length: 5 }).map((_, index) => {
                                        const filled = index < review.rating!;
                                        return (
                                            <svg key={index} width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2" className="mr-1">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="px-4 pb-3 flex gap-6">
                                <div className="flex-1">
                                    <p className="text-sm leading-relaxed text-gray-800 mb-3 text-justify">{review.content}</p>
                                    {review.repurchase && (
                                        <div className="space-y-0.5 text-xs">
                                            <p className="text-gray-700">
                                                <span>Repurchase:</span> <span className="font-semibold">Yes</span>
                                            </p>
                                            <p className="text-gray-600">
                                                <span>Usage period:</span> <span className="font-semibold">{review.usage_period}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Product Image - Smaller on the side */}
                                {review.item?.image_url && (
                                    <div className="w-24 h-24 shrink-0 ">
                                        <div className={`overflow-hidden ml-auto w-20 h-20`}>
                                            <div className="w-full h-full bg-linear-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden flex items-center justify-center">
                                                <Image src={review.item.image_url || ""} alt={review.user?.nickname || ""} width={96} height={96} className="object-cover w-full h-full" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Link>

                        <div className="flex items-center gap-4 px-4 pb-4 text-gray-600">
                            <button className={`flex items-center gap-1.5 text-sm hover:text-purple-600 transition-colors`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill={"currentColor"} stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <span>{review.like_count}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-sm hover:text-purple-600 transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <span>{review.comment_count}</span>
                            </button>
                        </div>
                    </article>
                ))
            )}
        </div>
    );
}
