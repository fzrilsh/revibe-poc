import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import PostDetailContent from "./_components/PostDetailContent";
import React from "react";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params) as { id: string };

    return (
        <>
            <Header />
            <main className="pt-28 pb-24 min-h-screen h-full">
                <PostDetailContent postId={id} />
            </main>
            <Navbar />
        </>
    );
}
