"use client";

import Header from "@navigation/header";
import ProductDetail from "./_components/ProductDetail";
import Navbar from "@navigation/navbar";
import React from "react";

export default function ProductDetailPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const params = React.use(searchParams);
    const productId = params.id || "1";

    const onBack = () => {
        window.history.back();
    };

    return (
        <>
            <Header />
            <main className="flex-center justify-start w-full min-h-screen flex-col py-24 px-6">
                <ProductDetail productId={productId} onBack={onBack} />
            </main>
            <Navbar />
        </>
    );
}
