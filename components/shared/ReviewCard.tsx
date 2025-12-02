import Image from "next/image";
import Link from "next/link";

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

interface ReviewCardProps {
    post: Post;
    onLike: (postId: string) => void;
    isLiked: boolean;
}

export function ReviewCard({ post, onLike, isLiked }: ReviewCardProps) {
    const lines = post.content.split("\n");
    const productTitle = lines[0];
    const reviewText = lines.slice(1).join("\n");

    return (
        <article className="bg-white overflow-hidden shadow-sm">
            <Link href={`/feed/community/review/${post.id}`} className="block">
                {/* Header */}
                <div className="flex items-start justify-between p-4 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0">
                            <Image src={post.author.avatar} alt={post.author.name} width={40} height={40} className="object-cover w-full h-full" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm leading-tight">{post.author.name}</h3>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                                {post.author.timestamp} - {post.author.skin_type?.join(", ")}
                            </p>
                        </div>
                    </div>
                    {post.badge && <span className={`${post.badge.color} text-white text-xs font-medium px-3 py-1 rounded-full`}>{post.badge.text}</span>}
                </div>

                {/* Product Title */}
                <div className="px-4 pb-2">
                    <h4 className="font-bold text-sm">{productTitle}</h4>
                </div>

                {post.rating !== undefined && (
                    <div className="px-4 pb-2 flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => {
                            const filled = index < post.rating!;
                            return (
                                <svg key={index} width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2" className="mr-1">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            );
                        })}
                    </div>
                )}

                {/* Review Content with Image Side by Side */}
                <div className="px-4 pb-3 flex gap-3">
                    <div className="flex-1">
                        <p className="text-sm leading-relaxed text-gray-800 mb-3">{reviewText}</p>
                        {post.repurchase && (
                            <div className="space-y-0.5 text-xs">
                                <p className="text-gray-700">
                                    <span>Repurchase:</span> <span className="font-semibold">Yes</span>
                                </p>
                                <p className="text-gray-600">
                                    <span>Usage period:</span> <span className="font-semibold">{post.repurchase.period.replace("Usage period: ", "")}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Product Image - Smaller on the side */}
                    {post.image && (
                        <div className="w-24 h-24 shrink-0">
                            <div className={`overflow-hidden w-20 h-20`}>
                                <div className="w-full h-full bg-linear-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden flex items-center justify-center">
                                    <Image src={post.image[0]} alt={post.author.name} width={96} height={96} className="object-cover w-full h-full" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            {/* Engagement */}
            <div className="flex items-center gap-4 px-4 pb-4 text-gray-600">
                <button onClick={() => onLike(post.id)} className={`flex items-center gap-1.5 text-sm hover:text-purple-600 transition-colors ${isLiked ? "text-red-500" : ""}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{post.engagement.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm hover:text-purple-600 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{post.engagement.comments}</span>
                </button>
            </div>
        </article>
    );
}
