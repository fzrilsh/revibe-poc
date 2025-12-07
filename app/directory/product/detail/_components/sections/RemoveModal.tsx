"use client";

export default function RemoveModal({ isOpen, onConfirm, onCancel }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col gap-6 items-center text-center">
                {/* Title */}
                <h2 className="text-2xl font-bold text-black">Remove Product</h2>

                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed">
                    All removed products will
                    <br />
                    be moved to History
                </p>

                {/* Buttons */}
                <div className="flex gap-3 w-full">
                    <button onClick={onCancel} className="flex-1 bg-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-600 transition-colors active:scale-95">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors active:scale-95">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
