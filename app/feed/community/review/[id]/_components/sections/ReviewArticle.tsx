import Image from "next/image";

// Helper function to validate URL
const isValidUrl = (urlString: string): boolean => {
    try {
        new URL(urlString);
        return true;
    } catch {
        return false;
    }
};

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
}

interface ReviewArticleProps {
    review: ReviewData;
    isLiked: boolean;
    onLike: () => void;
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

export default function ReviewArticle({ review, isLiked, onLike }: ReviewArticleProps) {
    const productName = review.item ? `${review.item.brand || ""} ${review.item.name || ""}`.trim() || "Product" : "Product";

    return (
        <article className="bg-white overflow-hidden shadow-sm mb-6 px-4">
            {/* Header */}
            <div className="flex items-start justify-between p-4 pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0">{review.user?.image_url && <Image src={review.user.image_url || "/community/profile/avatar1.svg"} alt={review.user.username} width={40} height={40} className="object-cover w-full h-full" />}</div>
                    <div>
                        <h3 className="font-semibold text-sm leading-tight">{review.user.username}</h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">{new Date(review.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}  - {skinTypeToLabel(review.user.skin_type || "")}</p>
                    </div>
                </div>
                <span className="bg-[#FFD16F] text-white text-xs font-medium px-3 py-1 rounded-full">Review</span>
            </div>

            {/* Product Title */}
            {review.item && (
                <div className="px-4 pb-2">
                    <h4 className="font-bold text-sm">{productName}</h4>
                </div>
            )}

            {/* Rating */}
            <div className="px-4 pb-2 flex items-center">
                {Array.from({ length: 5 }).map((_, index) => {
                    const filled = index < review.rating;
                    return (
                        <svg key={index} width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2" className="mr-1">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    );
                })}
            </div>

            {/* Review Content with Image */}
            <div className="px-4 pb-3 flex gap-3">
                <div className="flex-1">
                    <p className="text-sm leading-relaxed text-gray-800 mb-3">{review.content}</p>
                    {(review.repurchase !== null || review.usage_period) && (
                        <div className="space-y-0.5 text-xs">
                            {review.repurchase !== null && (
                                <p className="text-gray-700">
                                    <span>Repurchase:</span> <span className="font-semibold">{review.repurchase ? "Yes" : "No"}</span>
                                </p>
                            )}
                            {review.usage_period && (
                                <p className="text-gray-600">
                                    <span>Usage period:</span> <span className="font-semibold">{review.usage_period}</span>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Product Image */}
                {review.item?.image_url && isValidUrl(review.item.image_url) && (
                    <div className="w-24 h-24 shrink-0">
                        <div className="overflow-hidden w-20 h-20 rounded-lg bg-linear-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                            <Image src={review.item.image_url} alt={productName} width={96} height={96} className="object-cover w-full h-full" />
                        </div>
                    </div>
                )}
            </div>

            {/* Engagement */}
            <div className="flex items-center gap-4 px-4 pb-4 text-gray-600">
                <button onClick={onLike} className={`flex items-center gap-1.5 text-sm hover:text-purple-600 transition-colors ${isLiked ? "text-red-500" : ""}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{review.like_count}</span>
                </button>
                <div className="flex items-center gap-1.5 text-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{review.comment_count}</span>
                </div>
            </div>
        </article>
    );
}
