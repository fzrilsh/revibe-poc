import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import BlogDetailContent from "./_components/BlogDetailContent";
import React from "react";

interface BlogDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { id } = React.use(params) as { id: string };

    return (
        <>
            <Header />
            <main className="pt-24 pb-24 min-h-screen h-full px-6">
                <BlogDetailContent id={id} />
            </main>
            <Navbar />
        </>
    );
}
