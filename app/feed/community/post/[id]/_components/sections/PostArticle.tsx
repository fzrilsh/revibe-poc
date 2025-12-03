import Image from "next/image";

interface AuthorInfo {
    name: string;
    avatar: string;
    timestamp?: string;
}

interface PostArticleProps {
    likes: number;
    commentsCount: number;
    isLiked: boolean;
    onLike: () => void;
    author: AuthorInfo;
    content: string;
    images?: string[];
}

export default function PostArticle({ likes, commentsCount, isLiked, onLike, author, content, images }: PostArticleProps) {
    return (
        <article className="bg-white overflow-hidden shadow-sm mb-6">
            {/* Header */}
            <div className="flex items-start justify-between p-4 pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0">
                        <Image src={author.avatar} alt={author.name} width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm leading-tight">{author.name}</h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">{author.timestamp}</p>
                    </div>
                </div>
                <span className="bg-[#B6B2FF] text-white text-xs font-medium px-3 py-1 rounded-full">Post</span>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
                <p className="text-sm leading-relaxed text-gray-800 text-justify">{content}</p>
            </div>

            {/* Images */}
            <div className="px-4 pb-3">
                {images && images.length > 0 && (
                    <div className="relative flex gap-4 w-full rounded-xl overflow-hidden">
                        {images.map((img, idx) => (
                            <div key={idx} className="overflow-hidden w-20 h-20">
                                <div className="w-full h-full bg-linear-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden flex items-center justify-center">
                                    <Image src={img} alt={`Post image ${idx + 1}`} width={96} height={96} className="object-cover w-full h-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Engagement */}
            <div className="flex items-center gap-4 px-4 pb-4 text-gray-600">
                <button onClick={onLike} className={`flex items-center gap-1.5 text-sm hover:text-purple-600 transition-colors ${isLiked ? "text-red-500" : ""}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{likes}</span>
                </button>
                <div className="flex items-center gap-1.5 text-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{commentsCount}</span>
                </div>
            </div>
        </article>
    );
}
