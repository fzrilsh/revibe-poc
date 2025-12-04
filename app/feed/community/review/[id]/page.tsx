import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import ReviewDetailContent from "./_components/ReviewDetailContent";
import React from "react";

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params) as { id: string };

    return (
        <>
            <Header />
            <main className="pt-28 pb-24 min-h-screen h-full">
                <ReviewDetailContent reviewId={id} />
            </main>
            <Navbar />
        </>
    );
}
