"use client";

import BlogList from "./sections/BlogList";

export default function BlogContent() {
    return (
        <div className="flex flex-col gap-4 w-full">
            <BlogList />
        </div>
    );
}
