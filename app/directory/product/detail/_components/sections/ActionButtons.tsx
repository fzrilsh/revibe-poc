"use client";

import { useState } from "react";
import RemoveModal from "./RemoveModal";

interface ActionButtonsProps {
    onRemove: () => void;
    onShare: () => void;
}

export default function ActionButtons({ onRemove, onShare }: ActionButtonsProps) {
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const handleRemoveClick = () => {
        setShowRemoveModal(true);
    };

    const handleConfirmRemove = () => {
        setShowRemoveModal(false);
        onRemove();
    };

    const handleCancelRemove = () => {
        setShowRemoveModal(false);
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-3 pb-6 w-full">
                <button onClick={handleRemoveClick} className="bg-chetwode-blue text-white rounded-full py-3 active:scale-95 transition">
                    Remove
                </button>
                <button onClick={onShare} className="bg-black text-white rounded-full py-3 active:scale-95 transition">
                    Share
                </button>
            </div>

            <RemoveModal isOpen={showRemoveModal} onConfirm={handleConfirmRemove} onCancel={handleCancelRemove} />
        </>
    );
}
