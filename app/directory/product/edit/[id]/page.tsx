import React from "react";
import ProductEdit from "./_components/ProductEdit";
import Header from "@navigation/header";
import Navbar from "@navigation/navbar";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const p = React.use(params);
    const productId = p.id;

    return (
        <>
            <Header />
            <main className="flex-center justify-start w-full min-h-screen flex-col py-24 px-6">
                <ProductEdit productId={productId} />
            </main>
            <Navbar />
        </>
    );
}
