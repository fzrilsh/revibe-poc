"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CommentInputProps {
    onAddComment: (content: string) => void;
}

export default function CommentInput({ onAddComment }: CommentInputProps) {
    const [newComment, setNewComment] = useState("");
    const [currentUser, setCurrentUser] = useState<{ avatar: string; name: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const json = await res.json();
                    const user = json.data?.user;
                    if (user) {
                        setCurrentUser({
                            avatar: user?.profile_image ?? "/community/profile/avatar1.svg",
                            name: user?.nickname ?? "User",
                        });
                        setIsLoggedIn(true);
                    }
                }
            } catch (err) {
                console.error("Failed to load current user", err);
            }
        };
        loadCurrentUser();
    }, []);

    const handleSubmit = () => {
        if (newComment.trim() && isLoggedIn) {
            onAddComment(newComment);
            setNewComment("");
        }
    };

    return (
        <div className="fixed bottom-18 pb-4 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
            <div className="max-w-2xl mx-auto flex gap-3 items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden shrink-0">
                    <Image src={currentUser?.avatar ?? "/community/profile/avatar1.svg"} alt={currentUser?.name ?? "User"} width={32} height={32} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder={isLoggedIn ? "Leave a comment..." : "Login to comment..."}
                        disabled={!isLoggedIn}
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button onClick={handleSubmit} disabled={!newComment.trim() || !isLoggedIn} className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
