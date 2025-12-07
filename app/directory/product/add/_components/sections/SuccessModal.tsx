"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function SuccessModal({ imagePreview, onContinue }: { imagePreview?: string; onContinue: () => void }) {
    return (
        <div className="w-full mx-auto flex flex-col gap-6 relative">
            <motion.div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className="bg-onboarding fixed bottom-0 left-0 right-0 rounded-t-3xl p-8 w-full flex flex-col gap-6 items-center text-center"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 160, damping: 22 }}
                >
                    {/* Header */}
                    <div className="w-full flex-center">
                        <div className="h-1 w-20 bg-gray-300 rounded-full mb-6"></div>
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
                </motion.div>
            </motion.div>
        </div>
    );
}
