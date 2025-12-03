"use client";

import { useEffect, useState } from "react";
import NavigationHeader from "./sections/NavigationHeader";
import PostArticle from "./sections/PostArticle";
import CommentSection from "@shared/CommentSection";

interface CommentFromAPI {
    id: number;
    content: string;
    created_at: string;
    user: {
        nickname: string;
        profile_image: string;
    };
}

export default function PostDetailContent({ postId }: { postId: string }) {
    const [comments, setComments] = useState<CommentFromAPI[]>([]);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [postContent, setPostContent] = useState<string>("");
    const [postImages, setPostImages] = useState<string[]>([]);
    const [postAuthor, setPostAuthor] = useState<{ name: string; avatar: string; skinTypeLabel?: string[]; timestamp?: string }>({ name: "", avatar: "/community/profile/avatar1.svg" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/posts/${encodeURIComponent(postId)}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch post");
                }
                const json = await res.json();
                const p = json.data?.post;
                setLikes(p?.likes_count ?? 0);
                setIsLiked(p?.liked === true);
                setPostContent(p?.content ?? "");
                setPostImages(p?.image_url ? [p.image_url] : []);
                const skinLabel = [p?.author?.skin_type ? skinTypeToLabel(p.author.skin_type) : "Skin Type"];
                setPostAuthor({
                    name: p?.author?.nickname ?? "Community Member",
                    avatar: p?.author?.profile_image ?? "/community/profile/avatar1.svg",
                    skinTypeLabel: skinLabel,
                    timestamp: p?.created_at ? new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : undefined,
                });
                // Get comments from post response
                setComments(p?.comments ?? []);
                setError(null);
            } catch (err) {
                console.error("Failed to load post", err);
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [postId]);

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

    const handleCommentAdded = () => {
        // Reload post to get updated comments
        window.location.reload();
    };

    const handleLike = async () => {
        try {
            // Optimistic update: toggle
            setIsLiked((prev) => !prev);
            setLikes((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));

            const res = await fetch("/api/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target_type: "Post", target_id: parseInt(postId, 10) }),
            });
            if (!res.ok) {
                // revert on failure
                setIsLiked((prev) => !prev);
                setLikes((prev) => (isLiked ? prev + 1 : Math.max(0, prev - 1)));
            }
        } catch (err) {
            console.error("Failed to like post", err);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto flex items-center justify-center min-h-screen">
                <div className="text-center text-gray-500">Loading post...</div>
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
        <div className="max-w-2xl mx-auto">
            <NavigationHeader title="Post" />
            <PostArticle likes={likes} commentsCount={comments.length} isLiked={isLiked} onLike={handleLike} author={postAuthor} content={postContent} images={postImages} />
            <CommentSection 
                targetType="Post" 
                targetId={parseInt(postId, 10)} 
                initialComments={comments}
                onCommentAdded={handleCommentAdded}
            />
        </div>
    );
}
