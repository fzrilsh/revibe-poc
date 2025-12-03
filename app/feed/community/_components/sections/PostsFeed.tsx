import { PostCard } from "@shared/PostCard";
import { ReviewCard } from "@shared/ReviewCard";

interface Post {
    id: string;
    type: "post" | "review";
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
    item?: {
        id: number;
        brand: string | null;
        name: string | null;
        category: string | null;
        image_url: string | null;
    };
    repurchase?: {
        status: string;
        period: string;
    };
    engagement: {
        likes: number;
        comments: number;
    };
    liked?: boolean;
}

interface PostsFeedProps {
    posts: Post[];
    onLike: (postId: string) => void;
}

export default function PostsFeed({ posts, onLike }: PostsFeedProps) {
    return (
        <div className="space-y-4">
            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No posts yet. Be the first to share!</div>
            ) : (
                posts.map((post) => {
                    const isLiked = post.liked === true;
                    const isReview = post.type === "review";
                    const uniqueKey = `${post.type}-${post.id}`;

                    if (isReview) {
                        return <ReviewCard key={uniqueKey} post={post} onLike={onLike} isLiked={isLiked} />;
                    }

                    return <PostCard key={uniqueKey} post={post} onLike={onLike} isLiked={isLiked} />;
                })
            )}
        </div>
    );
}
