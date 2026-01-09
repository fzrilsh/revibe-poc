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
    content: string; // Full HTML content including images and tips
}

const blogData: Record<string, BlogContent> = {
    "1": {
        id: "1",
        author: "REVIBE Team",
        title: "Let's get started with REVIBE",
        date: "2 November 2025",
        thumbnail: "/home/banner_home.svg",
        content: `
            <p>Welcome to REVIBE—your companion for an intentional beauty journey.</p>
            <p>With so many trends and products around us, it's easy to feel overwhelmed. REVIBE helps you reconnect with what you already own and use your beauty products more mindfully.</p>
            <div class="relative w-full aspect-video rounded-xl overflow-hidden my-4">
                <img src="/community/blog-started.svg" alt="Let's get started with REVIBE" class="w-full h-full object-cover" />
            </div>
            <h3 class="font-bold text-xl mb-3">What You Can Do with REVIBE</h3>
            <div class="space-y-2">
                <div class="flex flex-col gap-2"><span class="text-sm shrink-0 font-medium">🧴 Organize Your Stash</span><p class="text-sm">Add your products and see everything in one clean, easy-to-navigate place.</p></div>
                <div class="flex flex-col gap-2"><span class="text-sm shrink-0 font-medium">🌿 Track Expiry & PAO</span><p class="text-sm">Stay safe and stress-free with gentle reminders before products expire.</p></div>
                <div class="flex flex-col gap-2"><span class="text-sm shrink-0 font-medium">📷 Connect with Others</span><p class="text-sm">Share empties, routines, and thoughts with a community that values mindful beauty. No pressure—just real, supportive conversations.</p></div>
                <div class="flex flex-col gap-2"><span class="text-sm shrink-0 font-medium">✨ Why REVIBE Exists</span><p class="text-sm">We built REVIBE to help you slow down, declutter, and rediscover joy in your routine. Beauty shouldn't feel heavy—it should feel grounding, empowering, and true to you.</p></div>
                <div class="flex flex-col gap-2"><span class="text-sm shrink-0 font-medium">💛 Your Beauty, Your Pace</span><p class="text-sm">REVIBE is here to guide you, not push you. One product, one choice, one mindful moment at a time.</p></div>
            </div>
        `,
    },
    "2": {
        id: "2",
        author: "REVIBE Team",
        title: "Learn about your product's Product After Opening (PAO)",
        date: "2 November 2025",
        thumbnail: "/community/pao.svg",
        content: `
            <p>Understanding Product After Opening (PAO) symbols helps you use your skincare products safely and effectively. The PAO symbol shows how many months a product remains safe to use after opening. This guide will help you identify these symbols and make informed decisions about your skincare routine.</p>
            <div class="relative w-full rounded-xl overflow-hidden my-4">
                <img src="/community/pao-product.svg" alt="Product After Opening (PAO)" class="w-full object-cover" />
            </div>
            <h3 class="font-bold text-xl mb-3">What Is PAO?</h3>
            <div className="space-y-2">
                <p>PAO is the number—usually 6M, 12M, or 24M—written inside the small open-jar symbol on your product packaging.</p>
                <ul class="list-disc list-inside my-4 indent-4 font-semibold">
                    <li>
                        6M = safe for 6 months after opening
                    </li>
                    <li>
                        12M = safe for 12 months after opening
                    </li>
                    <li>
                        24M = safe for 24 months after opening
                    </li>
                </ul>
                <p>After this period, your product may lose potency, change texture, or become less hygienic for your skin.</p>
            </div>
            <h3 class="font-bold text-xl mb-3">Why PAO Matters</h3>
            <div className="space-y-2">
                <p>Using products beyond their PAO can affect:</p>
                <ul class="list-disc list-inside my-4 indent-4">
                    <li>
                        <strong>Effectiveness:</strong> Ingredients may break down and stop delivering results.
                    </li>
                    <li>
                        <strong>Safety:</strong> Old products can harbor bacteria, especially creams and eye products.
                    </li>
                    <li>
                        <strong>Waste:</strong> Knowing your PAO helps you finish products on time and reduce overconsumption.
                    </li>
                </ul>
                <p>PAO isn’t meant to scare you—it's a helpful guide to use what you already have, more intentionally. By understanding and tracking PAO, you’re giving your skin the care it deserves—fresh, safe, and effective products every time. It’s one small habit that leads to a more mindful, sustainable beauty journey.</p>
            </div>
        `,
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
            <BlogBody content={blog.content} />
        </div>
    );
}
