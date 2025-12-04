interface ActionButtonsProps {
    onRemove: () => void;
    onShare: () => void;
}

export default function ActionButtons({ onRemove, onShare }: ActionButtonsProps) {
    return (
        <div className="grid grid-cols-2 gap-3 pb-6 w-full">
            <button onClick={onRemove} className="bg-cerise-red text-white rounded-full py-3 active:scale-95 transition">
                Remove
            </button>
            <button onClick={onShare} className="bg-black text-white rounded-full py-3 active:scale-95 transition">
                Share
            </button>
        </div>
    );
}
