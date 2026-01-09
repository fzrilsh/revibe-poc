"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { FaGoogle, FaInstagram, FaLink, FaWhatsapp } from "react-icons/fa6";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        name: string;
        image: string;
        colorVariant: string;
    };
}

export default function ShareModal({ isOpen, onClose, product }: ShareModalProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    if (!isOpen && !isAnimating) return null;

    const shareMessage = "I really enjoyed this product and would recommend you to try!";

    const handleShare = (platform: string) => {
        console.log(`Share to ${platform}`);
    };

    return (
        <div className={`fixed inset-0 z-100 flex items-end justify-center transition-colors duration-300 ${isAnimating ? "bg-black/50 backdrop-blur-lg" : "bg-transparent"}`} onClick={handleClose}>
            <div className={`bg-linear-to-b from-portage to-black rounded-t-3xl w-full max-w-md p-6 pb-8 transition-transform duration-300 ${isAnimating ? "translate-y-0" : "translate-y-full"}`} onClick={(e) => e.stopPropagation()}>
                {/* Handle bar */}
                <div className="w-12 h-1 bg-white/40 rounded-full mx-auto mb-6" />

                {/* Title */}
                <h2 className="text-white text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                    <span>🎉</span>
                    Product Finished!
                    <span>🎉</span>
                </h2>

                {/* Product Card */}
                <div className=" p-4 mb-4 flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <p className="text-white text-lg text-center mb-2">{product.name}</p>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} className={`text-base ${product.name ? "text-yellow-400" : "text-gray-300"}`} />
                        ))}
                    </div>
                </div>

                {/* Message */}
                <p className="text-white text-center text-lg mb-6 px-4">{shareMessage}</p>

                {/* Share Buttons */}
                <div className="grid grid-cols-4 gap-4">
                    <ShareButton icon={FaLink} label="Copy Link" onClick={() => handleShare("copy")} bgColor="bg-gray-600" />
                    <ShareButton icon={FaWhatsapp} label="Whatsapp" onClick={() => handleShare("whatsapp")} bgColor="bg-green-500" />
                    <ShareButton icon={FaInstagram} label="Instagram" onClick={() => handleShare("instagram")} bgColor="bg-pink-500" />
                    <ShareButton icon={FaGoogle} label="Email" onClick={() => handleShare("email")} bgColor="bg-blue-500" />
                </div>
            </div>
        </div>
    );
}

function ShareButton({ icon: Icon, label, onClick, bgColor }: { icon: React.ComponentType; label: string; onClick: () => void; bgColor: string }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center gap-2">
            <div className={`w-14 h-14 ${bgColor} text-white rounded-full flex items-center justify-center text-2xl active:scale-95 transition`}>
                <Icon />
            </div>
            <span className="text-white text-xs font-medium">{label}</span>
        </button>
    );
}