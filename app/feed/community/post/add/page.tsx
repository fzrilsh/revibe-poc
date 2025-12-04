"use client";

import Header from "@navigation/header";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

interface PostFormData {
    content: string;
    images: File[];
    imagePreviews: string[];
}

export default function PostAddPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<PostFormData>({
        content: "",
        images: [],
        imagePreviews: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const remainingSlots = 4 - formData.images.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        const newImages: File[] = [];
        const newPreviews: string[] = [];

        filesToProcess.forEach((file) => {
            newImages.push(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === filesToProcess.length) {
                    setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, ...newImages],
                        imagePreviews: [...prev.imagePreviews, ...newPreviews],
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.content) return;

        setIsSubmitting(true);

        try {
            const formPayload = new FormData();
            formPayload.append("content", formData.content);

            // Add first image if available (API supports single image upload)
            if (formData.images.length > 0) {
                formPayload.append("image", formData.images[0]);
            }

            const response = await fetch("/api/posts", {
                method: "POST",
                body: formPayload,
            });

            if (!response.ok) {
                throw new Error("Failed to create post");
            }

            const result = await response.json();
            console.log("Post created:", result);

            // Redirect to community feed
            router.push("/feed/community");
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <main className="pt-28 pb-5 min-h-screen h-full w-full px-6">
                <div className="flex-center gap-2 w-full">
                    <div className="flex-between items-center w-full mb-4">
                        <button onClick={() => window.history.back()}>
                            <LuArrowLeft className="text-2xl" />
                        </button>
                        <h2 className="text-xl font-semibold">Create Review</h2>
                        <span />
                    </div>
                    <p>Share your thoughts with community!</p>
                </div>

                <form onSubmit={handleSubmit} className="flex-center w-full min-h-full px-4 mt-4">
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-2">What do you want to share today?</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full bg-white  px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px]"
                            placeholder="Share your thoughts about products, describe your experience, or ask questions to the community..."
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium mb-2">Upload photos</label>
                        <div className="flex gap-2 flex-wrap">
                            {formData.imagePreviews.map((image, index) => (
                                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                                    <Image src={image} alt={`Upload ${index + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80">
                                        ✕
                                    </button>
                                </div>
                            ))}
                            {formData.imagePreviews.length < 4 && (
                                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500 transition">
                                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                    <span className="text-3xl text-gray-400">+</span>
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Add up to 4 photos ({formData.imagePreviews.length}/4)</p>
                    </div>

                    <button type="submit" disabled={isSubmitting || !formData.content} className="w-full bg-black text-white mt-auto py-3 rounded-full font-semibold hover:bg-gray-800 active:scale-[.98] transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </main>
        </>
    );
}
