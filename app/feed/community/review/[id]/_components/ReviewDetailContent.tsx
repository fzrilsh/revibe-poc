"use client";

import { useState, useEffect } from "react";
import NavigationHeader from "./sections/NavigationHeader";
import ReviewArticle from "./sections/ReviewArticle";
import CommentSection from "@shared/CommentSection";

interface CommentFromAPI {
    id: number;
    content: string;
    created_at: string;
    user: {
        username: string;
        image_url: string;
    };
}

interface ReviewData {
    id: number;
    item_id: number;
    rating: number;
    repurchase: boolean | null;
    usage_period: string | null;
    content: string;
    created_at: string;
    like_count: number;
    comment_count: number;
    comments: CommentFromAPI[];
    user: {
        username: string;
        image_url: string;
        skin_type: string | null;
    };
    item?: {
        id: number;
        brand: string | null;
        name: string | null;
        category: string | null;
        image_url: string | null;
    };
    liked?: boolean;
}

export default function ReviewDetailContent({ reviewId }: { reviewId: string }) {
    const [comments, setComments] = useState<CommentFromAPI[]>([]);
    const [review, setReview] = useState<ReviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const reviewRes = await fetch(`/api/reviews/${encodeURIComponent(reviewId)}`);
                if (!reviewRes.ok) throw new Error("Failed to fetch review");

                const reviewData = await reviewRes.json();
                const reviewObj = reviewData.data?.review;
                setComments(reviewObj?.comments ?? []);

                if (reviewObj) {
                    setReview(reviewObj);
                    setIsLiked(reviewObj.liked || false);
                }
            } catch (err) {
                console.error("Error fetching review:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reviewId]);

    const handleCommentAdded = () => {
        // Reload review to get updated comments
        window.location.reload();
    };

    const handleLike = async () => {
        if (!review) return;
        const prevIsLiked = isLiked;

        // Optimistic update
        setIsLiked(!isLiked);

        try {
            const response = await fetch("/api/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    target_type: "Review",
                    target_id: parseInt(reviewId),
                }),
            });

            if (!response.ok) {
                // Revert on error
                setIsLiked(prevIsLiked);
            }
        } catch (err) {
            console.error("Error liking review:", err);
            // Revert on error
            setIsLiked(prevIsLiked);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto flex items-center justify-center min-h-screen">
                <div className="text-center text-gray-500">Loading review...</div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="max-w-2xl mx-auto flex items-center justify-center min-h-screen">
                <div className="text-center text-red-500">Review not found</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <NavigationHeader title="Review" />
            <ReviewArticle review={review} isLiked={isLiked} onLike={handleLike} />
            <CommentSection targetType="Review" targetId={parseInt(reviewId, 10)} initialComments={comments} onCommentAdded={handleCommentAdded} />
        </div>
    );
}
