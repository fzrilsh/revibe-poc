"use client";

import { useState } from "react";
import CommentInput from "./CommentInput";
import Image from "next/image";

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: {
        nickname?: string;
        username?: string;
        profile_image?: string;
        image_url?: string;
    };
}

interface CommentSectionProps {
    targetType: "Post" | "Review";
    targetId: number;
    initialComments: Comment[];
    onCommentAdded?: () => void;
}

export default function CommentSection({ targetType, targetId, initialComments, onCommentAdded }: CommentSectionProps) {
    const [comments] = useState<Comment[]>(initialComments);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddComment = async (content: string) => {
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    target_type: targetType,
                    target_id: targetId,
                    content: content.trim(),
                }),
            });

            const data = await response.json();

            if (data.status === "success") {
                // Refresh to get updated comments from server
                if (onCommentAdded) {
                    onCommentAdded();
                } else {
                    window.location.reload();
                }
            } else {
                alert(data.message || "Failed to post comment");
            }
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Failed to post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const getUserName = (user: Comment["user"]) => {
        return user?.nickname || user?.username || "Anonymous";
    };

    const getUserImage = (user: Comment["user"]) => {
        return user?.profile_image || user?.image_url || "/community/profile/avatar1.svg";
    };

    return (
        <div className="pb-24">
            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">No comments yet. Be the first to comment!</div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex-start flex-col gap-3 bg-white px-6 py-4">
                            <div className="flex-start flex-row gap-4">
                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                                    <Image src={getUserImage(comment.user)} alt={getUserName(comment.user)} width={32} height={32} className="object-cover w-full h-full" />
                                </div>
                                <div className="flex-start flex-col">
                                    <p className="font-semibold text-xs mb-1">{getUserName(comment.user)}</p>
                                    <p className="text-[10px] text-gray-500">{formatDate(comment.created_at)}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-800">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Comment Input */}
            <CommentInput onAddComment={handleAddComment} />
        </div>
    );
}
