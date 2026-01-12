"use client";

import { CiHeart, CiPen } from "react-icons/ci";
import { useState, useEffect } from "react";

interface CreateModalProp {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateModal({ isOpen, onClose }: CreateModalProp) {
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

    return (
        <div className={`fixed inset-0 z-100 flex items-end justify-center transition-colors duration-300 ${isAnimating ? "bg-black/50 backdrop-blur-lg" : "bg-transparent"}`} onClick={handleClose}>
             <div className={`w-full max-w-md rounded-t-3xl bg-linear-to-b from-[#F7F5FE] to-[#E8E7FC] p-6 pb-8 max-h-[90vh] overflow-y-auto transition-transform duration-300 ${isAnimating ? "translate-y-0" : "translate-y-full"}`} onClick={(e) => e.stopPropagation()}>
                <>
                    <h2 className="text-center text-2xl font-semibold mb-4">Create</h2>
                    <button onClick={() => (window.location.href = "/feed/community/review/add")} className="w-full mt-2 flex-center flex-row gap-2 rounded-full bg-white hover:bg-neutral-50 py-3 active:scale-[.97] transition">
                        <CiHeart className="text-2xl" /> Add Review
                    </button>
                    <button onClick={() => (window.location.href = "/feed/community/post/add")} className="w-full mt-2 flex-center flex-row gap-2 rounded-full bg-white hover:bg-neutral-50 py-3 active:scale-[.97] transition">
                        <CiPen className="text-2xl" /> Add Post
                    </button>
                </>
            </div>
        </div>
    );
}
