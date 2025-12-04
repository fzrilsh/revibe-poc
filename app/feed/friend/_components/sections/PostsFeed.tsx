import { PostCard } from "@shared/PostCard";
import { ReviewCard } from "@shared/ReviewCard";

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

interface PostsFeedProps {
    posts: Post[];
    onLike: (postId: string) => void;
    likedPosts: Set<string>;
}

export default function PostsFeed({ posts, onLike, likedPosts }: PostsFeedProps) {
    const samplePostsInitialLikes = [50, 50, 50]; // Initial likes for posts 1, 2, 3

    return (
        <>
            {posts.map((post, index) => {
                const isReview = post.badge?.text === "Review";
                const initialLikes = samplePostsInitialLikes[index] || 50;
                const isLiked = likedPosts.has(post.id);

                if (isReview) {
                    return <ReviewCard key={`${post.id}-review`} post={post} onLike={onLike} isLiked={isLiked} />;
                }

                return <PostCard key={`${post.id}-post`} post={post} onLike={onLike} isLiked={isLiked} />;
            })}
        </>
    );
}
