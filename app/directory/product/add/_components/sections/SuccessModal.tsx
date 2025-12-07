"use client";

import Image from "next/image";

export default function SuccessModal({ imagePreview, onContinue }: { imagePreview?: string; onContinue: () => void }) {
    return (
        <div className="w-full max-w-md mx-auto flex flex-col gap-6">
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
                <div className="bg-blue-chalk rounded-3xl p-8 w-full max-w-sm flex flex-col gap-6 items-center text-center">
                    {/* Header */}
                    <div className="w-full">
                        <div className="h-1 bg-gray-300 rounded-full mb-6"></div>
                    </div>

                    {/* Title */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-black">
                            You&apos;ve added
                            <br />
                            your first product!
                        </h2>
                    </div>

                    {/* Image */}
                    <div className="w-40 h-40 rounded-2xl bg-gray-200 overflow-hidden flex items-center justify-center relative">{imagePreview ? <Image src={imagePreview} alt="Product" fill className="object-cover" /> : <div className="text-gray-400">No image</div>}</div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed">
                        Every product has a story –<br />
                        and this is where you start
                        <br />
                        noticing yours. 🌱
                    </p>

                    {/* Continue Button */}
                    <button onClick={onContinue} className="w-full bg-black text-white py-4 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
