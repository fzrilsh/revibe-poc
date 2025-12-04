"use client";

import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import ProfileContent from "./_components/ProfileContent";

export default function ProfilePage() {
    return (
        <>
            <Header />
            <main className="pt-20 pb-24 min-h-screen h-full">
                <ProfileContent />
            </main>
            <Navbar />
        </>
    );
}
