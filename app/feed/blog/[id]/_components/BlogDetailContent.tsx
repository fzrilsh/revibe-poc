"use client";

import NavigationHeader from "./sections/NavigationHeader";
import BlogHeroImage from "./sections/BlogHeroImage";
import BlogHeader from "./sections/BlogHeader";
import BlogBody from "./sections/BlogBody";

interface BlogDetailProps {
    id: string;
}

interface BlogContent {
    id: string;
    author: string;
    title: string;
    date: string;
    thumbnail: string;
    content: string;
    tips?: {
        icon: string;
        text: string;
    }[];
    images?: string[];
}

const blogData: Record<string, BlogContent> = {
    "1": {
        id: "1",
        author: "REVIBE Team",
        title: "Let's get started with REVIBE",
        date: "2 November 2025",
        thumbnail: "/challenge/minimalist.svg",
        content:
            "Simplify your routine and reconnect with what truly matters. For the next 30 days, focus on using only the essentials – the products your skin actually needs. This challenge helps you clear out the clutter, reduce overconsumption, and find calm in a more intentional beauty rhythm.",
        tips: [
            { icon: "✅", text: "Start small. Focus on one category first." },
            { icon: "🎯", text: "Use what you have. Finish what's already open." },
            { icon: "📊", text: "Track progress. Note small changes weekly." },
            { icon: "💭", text: "Reflect often. Keep what truly works." },
            { icon: "✨", text: "Celebrate less. Simplicity is success." },
        ],
        images: ["/challenge/minimalist.svg"],
    },
    "2": {
        id: "2",
        author: "REVIBE Team",
        title: "Learn about your product's Product After Opening (PAO)",
        date: "2 November 2025",
        thumbnail: "/challenge/skin_fasting.svg",
        content:
            "Understanding Product After Opening (PAO) symbols helps you use your skincare products safely and effectively. The PAO symbol shows how many months a product remains safe to use after opening. This guide will help you identify these symbols and make informed decisions about your skincare routine.",
        tips: [
            { icon: "🔍", text: "Check the PAO symbol on product packaging." },
            { icon: "📅", text: "Write opening dates on products." },
            { icon: "🧴", text: "Store products in cool, dry places." },
            { icon: "👃", text: "Discard if smell or texture changes." },
            { icon: "✋", text: "Always use clean hands or spatulas." },
        ],
        images: ["/opening_1.svg"],
    },
};

export default function BlogDetailContent({ id }: BlogDetailProps) {
    const blog = blogData[id];

    if (!blog) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Blog not found</p>
            </div>
        );
    }

    return (
        <div className="pb-8">
            <NavigationHeader title="Blog" />
            <BlogHeroImage src={blog.thumbnail} alt={blog.title} />
            <BlogHeader author={blog.author} title={blog.title} />
            <BlogBody content={blog.content} images={blog.images} tips={blog.tips} title={blog.title} />
        </div>
    );
}
