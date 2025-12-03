import Image from "next/image";
import Link from "next/link";

interface BlogPost {
    id: string;
    author: string;
    title: string;
    date: string;
    thumbnail: string;
    excerpt?: string;
}

interface BlogCardProps {
    blog: BlogPost;
}

export function BlogCard({ blog }: BlogCardProps) {
    return (
        <Link href={`/feed/blog/${blog.id}`}>
            <div className="bg-white overflow-hidden w-full transition p-4">
                {/* Thumbnail */}
                <div className="relative w-full rounded-2xl h-40 overflow-hidden bg-linear-to-br from-purple-200 to-blue-200">
                    <Image
                        src={blog.thumbnail}
                        alt={blog.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-sm text-purple-600 mb-2">
                        {blog.author}
                    </p>
                    <h3 className="font-bold text-2xl mb-1">
                        {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500">{blog.date}</p>
                </div>
            </div>
        </Link>
    );
}
