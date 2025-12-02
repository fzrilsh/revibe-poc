"use client";

import { CiHeart, CiPen } from "react-icons/ci";

interface CreateModalProp {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateModal({ isOpen, onClose }: CreateModalProp) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-100 flex items-end justify-center" onClick={onClose}>
            <div className="w-full max-w-md rounded-t-3xl bg-linear-to-b from-[#F7F5FE] to-[#E8E7FC] p-6 pb-8 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
