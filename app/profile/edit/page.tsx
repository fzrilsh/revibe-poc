"use client";

import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import { LuArrowLeft } from "react-icons/lu";
import EditProfileForm from "./_components/EditProfileForm";

export default function EditProfilePage() {
    return (
        <>
            <Header />
            <main className="pt-24 pb-24 min-h-screen">
                <div className="flex-between items-center gap-3 mb-6 pt-6 px-6 w-full max-w-md mx-auto">
                    <button type="button" onClick={() => window.history.back()} className="p-1 rounded hover:bg-gray-100">
                        <LuArrowLeft className="text-xl" />
                    </button>
                    <h1 className="text-lg font-semibold flex-1 text-center">Edit My Profile</h1>
                    <div className="w-10" />
                </div>

                <div className="w-full max-w-md mx-auto px-6">
                    <EditProfileForm />
                </div>
            </main>
            <Navbar />
        </>
    );
}
