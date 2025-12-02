"use client";

import { FaGoogle, FaInstagram, FaLink, FaWhatsapp } from "react-icons/fa6";
import Image from "next/image";

interface ChallengeJoinModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    image: string;
}

export default function ChallengeJoinModal({ open, onClose, title, image }: ChallengeJoinModalProps) {
    if (!open) return null;

    const handleShare = (platform: string) => {
        console.log("Share challenge via", platform);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-100 flex items-end justify-center" onClick={onClose}>
            <div className="w-full max-w-md rounded-t-3xl bg-onboarding p-6 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                <h2 className="text-center text-2xl font-bold mb-4">Congratulations! 🎉</h2>
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-6 bg-gray-100">
                    <Image src={image} alt={title} fill className="object-cover" />
                </div>
                <p className="text-center text-2xl font-semibold mb-3">You have just joined your first challenge!</p>
                <p className="text-center text-base text-gray-600 mb-6">Come back later to update your progress, or share so others can join.</p>
                <div className="grid grid-cols-4 gap-4">
                    <ShareButton icon={FaLink} label="Copy Link" onClick={() => handleShare("copy")} bgColor="bg-gray-600" />
                    <ShareButton icon={FaWhatsapp} label="Whatsapp" onClick={() => handleShare("whatsapp")} bgColor="bg-green-500" />
                    <ShareButton icon={FaInstagram} label="Instagram" onClick={() => handleShare("instagram")} bgColor="bg-pink-500" />
                    <ShareButton icon={FaGoogle} label="Email" onClick={() => handleShare("email")} bgColor="bg-blue-500" />
                </div>
                <button onClick={onClose} className="w-full mt-2 rounded-full bg-black text-white py-3 text-sm font-medium active:scale-[.97] transition">
                    Close
                </button>
            </div>
        </div>
    );
}

function ShareButton({ icon: Icon, label, onClick, bgColor }: { icon: React.ComponentType; label: string; onClick: () => void; bgColor: string }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center gap-2">
            <div className={`w-14 h-14 ${bgColor} text-white rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-95 transition`}>
                <Icon />
            </div>
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}
