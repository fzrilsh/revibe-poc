"use client";
import StatsSection from "./sections/StatsSection";
import FriendsAvatars from "./sections/FriendsAvatars";
import PostsFeed from "./sections/PostsFeed";
import AddFriendsButton from "./sections/AddFriendsButton";
import { useState, useEffect } from "react";

interface Friend {
    id: string;
    name: string;
    avatar: string;
}

interface Post {
    id: string;
    author: {
        name: string;
        avatar: string;
        timestamp: string;
        skin_type?: string[];
    };
    content: string;
    image?: string[];
    rating?: number;
    badge?: {
        text: string;
        color: string;
    };
    repurchase?: {
        status: string;
        period: string;
    };
    engagement: {
        likes: number;
        comments: number;
    };
}

const sampleFriends: Friend[] = [
    { id: "1", name: "Ismi", avatar: "/community/profile/avatar1.svg" },
    { id: "2", name: "Ayu", avatar: "/community/profile/avatar2.svg" },
    { id: "3", name: "Tania", avatar: "/community/profile/avatar3.svg" },
];

// Helpers
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

const transformPost = (post: any): Post => {
    const nickname = post.author?.nickname ?? "Community Member";
    const avatar = post.author?.profile_image ?? "/community/profile/avatar1.svg";
    const skinTypeEnum = post.author?.skin_type ?? null;
    const skin = skinTypeEnum ? skinTypeToLabel(skinTypeEnum) : "Skin Type";
    return {
        id: post.id.toString(),
        author: {
            name: nickname,
            avatar,
            timestamp: new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            skin_type: [skin],
        },
        content: post.content || "No content",
        image: post.image_url ? [post.image_url] : undefined,
        badge: { text: "Post", color: "bg-[#B6B2FF]" },
        engagement: { likes: post.likes_count || 0, comments: post.comments_count || 0 },
    };
};

const transformReview = (review: any): Post => {
    const nickname = review.user?.nickname ?? "Community Member";
    const avatar = review.user?.image_url ?? "/community/profile/avatar1.svg";
    const productName = review.item ? `${review.item.brand || ""} ${review.item.name || ""}`.trim() : "Product Review";
    const reviewContent = `${productName}\n${review.content || ""}`;
    return {
        id: review.id.toString(),
        author: {
            name: nickname,
            avatar,
            timestamp: new Date(review.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            skin_type: ["Skin Type"],
        },
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
    };
};

const fetchFeed = async () => {
    const [postsRes, reviewsRes] = await Promise.all([fetch("/api/posts"), fetch("/api/reviews")]);
    if (!postsRes.ok || !reviewsRes.ok) throw new Error("Failed to fetch data");
    const [postsJson, reviewsJson] = await Promise.all([postsRes.json(), reviewsRes.json()]);
    const posts: Post[] = (postsJson.data?.posts || []).map(transformPost);
    const reviews: Post[] = (reviewsJson.data?.reviews || []).map(transformReview);
    return [...posts, ...reviews].sort((a, b) => new Date(b.author.timestamp).getTime() - new Date(a.author.timestamp).getTime());
};

export default function FriendContent() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchFeed();
                setPosts(data);
            } catch (e) {
                // swallow errors for now; friend feed keeps simple
                console.error("Error loading friend feed", e);
            }
        };
        load();
    }, []);

    const handleLike = (postId: string) => {
        setLikedPosts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });

        setPosts((prev) =>
            prev.map((post) => {
                if (post.id === postId) {
                    const isLiked = likedPosts.has(postId);
                    return {
                        ...post,
                        engagement: {
                            ...post.engagement,
                            likes: isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1,
                        },
                    };
                }
                return post;
            })
        );
    };

    return (
        <div className="space-y-4 w-full">
            <div className="bg-onboarding">
                <StatsSection />
                <FriendsAvatars friends={sampleFriends} />
            </div>
            <PostsFeed posts={posts} onLike={handleLike} likedPosts={likedPosts} />
            <AddFriendsButton />
        </div>
    );
}
