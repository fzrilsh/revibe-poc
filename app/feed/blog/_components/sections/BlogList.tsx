import { BlogCard } from "./BlogCard";

interface BlogPost {
    id: string;
    author: string;
    title: string;
    date: string;
    thumbnail: string;
    excerpt?: string;
}

const sampleBlogs: BlogPost[] = [
    {
        id: "1",
        author: "REVIBE Team",
        title: "Let's get started with REVIBE",
        date: "2 November 2025",
        thumbnail: "/home/banner_home.svg",
    },
    {
        id: "2",
        author: "REVIBE Team",
        title: "Learn about your product's Product After Opening (PAO)",
        date: "2 November 2025",
        thumbnail: "/community/pao.svg",
    },
];

export default function BlogList() {
    return (
        <>
            {sampleBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
            ))}
        </>
    );
}
