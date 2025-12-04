"use client";

import Header from "@navigation/header";
import AddProductForm from "./_components/AddProductForm";

export default function ProductAddPage() {
    return (
        <>
            <Header />
            <main className="flex-center justify-start w-full min-h-screen flex-col pt-24 pb-5 px-6">
                <AddProductForm onBack={() => window.history.back()} />
            </main>
        </>
    );
}
