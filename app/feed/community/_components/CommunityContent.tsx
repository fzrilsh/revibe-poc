"use client";
import { useState, useEffect, useCallback } from "react";
import PostsFeed from "./sections/PostsFeed";
import FloatingActionButton from "./sections/FloatingActionButton";
import CreateModal from "@shared/CreateModal";

interface Post {
    id: string;
    type: "post" | "review"; // Add type discriminator
    author: {
        name: string;
        avatar: string;
        timestamp: string;
        skin_type?: string[];
    };
    item?: {
        id: number;
        brand: string | null;
        name: string | null;
        category: string | null;
        image_url: string | null;
    };
    content: string;
    image?: string[];
    badge?: {
        text: string;
        color: string;
    };
    rating?: number; // For reviews
    repurchase?: {
        status: string;
        period: string;
    }; // For reviews
    engagement: {
        likes: number;
        comments: number;
    };
    liked?: boolean;
    created_at: string; // Keep original timestamp for accurate sorting
}

function skinTypeToLabel(skinType: string): string {
    switch (skinType) {
        case "OILY":
            return "Oily Skin";
        case "DRY":
            return "Dry Skin";
        case "COMBINATION":
            return "Combination Skin";
        case "SENSITIVE":
            return "Sensitive Skin";
        case "NORMAL":
            return "Normal Skin";
        default:
            return "Skin Type";
    }
}

export default function CommunityContent() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // current viewer is not used to populate author; we rely on post.author from API

    // Helpers to transform API payloads into local Post shape
    const transformPost = (post: any): Post => {
        const authorNickname = post.author?.nickname ?? "Community Member";
        const authorAvatar = post.author?.profile_image ?? "/community/profile/avatar1.svg";
        const authorSkinTypeEnum = post.author?.skin_type ?? null;
        const skinLabel = authorSkinTypeEnum ? skinTypeToLabel(authorSkinTypeEnum) : "Skin Type";
        return {
            id: post.id.toString(),
            type: "post",
            author: {
                name: authorNickname,
                avatar: authorAvatar,
                timestamp: new Date(post.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }),
                skin_type: [skinLabel],
            },
            content: post.content || "No content",
            image: post.image_url ? [post.image_url] : undefined,
            badge: { text: "Post", color: "bg-[#B6B2FF]" },
            engagement: { likes: post.likes_count || 0, comments: post.comments_count || 0 },
            liked: post.liked === true,
            created_at: post.created_at,
        };
    };

    const transformReview = (review: any): Post => {
        const authorNickname = review.user?.nickname ?? "Community Member";
        const authorAvatar = review.user?.image_url ?? "/community/profile/avatar1.svg";
        const productName = review.item ? `${review.item.brand || ""} ${review.item.name || ""}`.trim() : "Product Review";
        const reviewContent = `${productName}\n${review.content || ""}`;
        return {
            id: review.id.toString(),
            type: "review",
            author: {
                name: authorNickname,
                avatar: authorAvatar,
                timestamp: new Date(review.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }),
                skin_type: ["Skin Type"],
            },
            item: review.item ? {
                id: review.item.id,
                brand: review.item.brand ?? null,
                name: review.item.name ?? null,
                category: review.item.category ?? null,
                image_url: review.item.image_url ?? null,
            } : undefined,
            content: reviewContent,
            image: review.item?.image_url ? [review.item.image_url] : undefined,
            badge: { text: "Review", color: "bg-bright-sun" },
            rating: review.rating ?? undefined,
            repurchase:
                review.repurchase !== null
                    ? {
                          status: review.repurchase ? "Yes" : "No",
                          period: review.usage_period ? `Usage period: ${review.usage_period}` : "",
                      }
                    : undefined,
            engagement: { likes: review.likes_count || 0, comments: review.comments_count || 0 },
            liked: review.liked === true,
            created_at: review.created_at,
        };
    };

    const fetchFeed = useCallback(async () => {
        const [postsRes, reviewsRes] = await Promise.all([fetch("/api/posts"), fetch("/api/reviews")]);
        if (!postsRes.ok || !reviewsRes.ok) throw new Error("Failed to fetch data");
        const [postsJson, reviewsJson] = await Promise.all([postsRes.json(), reviewsRes.json()]);
        const transformedPosts: Post[] = (postsJson.data?.posts || []).map(transformPost);
        const transformedReviews: Post[] = (reviewsJson.data?.reviews || []).map(transformReview);
        // Sort by created_at timestamp (newest first)
        const combined = [...transformedPosts, ...transformedReviews].sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        return combined;
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const combined = await fetchFeed();
                setPosts(combined);
                setError(null);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Failed to load posts");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [fetchFeed]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            const combined = await fetchFeed();
            setPosts(combined);
        } catch (err) {
            console.error("Error refreshing posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        const targetType = post.type === "post" ? "Post" : "Review";

        try {
            // Optimistic update
            setPosts((prev) =>
                prev.map((p) => {
                    if (p.id === postId) {
                        // If already liked, do nothing (prevent double-like on UI)
                        if (p.liked) return p;
                        return {
                            ...p,
                            engagement: { ...p.engagement, likes: p.engagement.likes + 1 },
                            liked: true,
                        };
                    }
                    return p;
                })
            );

            const response = await fetch("/api/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target_type: targetType, target_id: parseInt(postId) }),
            });

            if (!response.ok) {
                // Revert optimistic update if API call fails
                setPosts((prev) =>
                    prev.map((p) => {
                        if (p.id === postId) {
                            return {
                                ...p,
                                engagement: { ...p.engagement, likes: Math.max(0, p.engagement.likes - 1) },
                                liked: false,
                            };
                        }
                        return p;
                    })
                );
            }
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto flex items-center justify-center min-h-screen">
                <div className="text-center text-gray-500">Loading posts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto flex items-center justify-center min-h-screen">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <PostsFeed posts={posts} onLike={handleLike} />
                <FloatingActionButton onClick={() => setShowCreateModal(true)} />
            </div>

            <CreateModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    handleRefresh();
                }}
            />
        </>
    );
}
