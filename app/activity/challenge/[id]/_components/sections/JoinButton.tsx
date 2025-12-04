interface JoinButtonProps {
    joined: boolean;
    onJoin: () => void;
}

export default function JoinButton({ joined, onJoin }: JoinButtonProps) {
    return (
        <button disabled={joined} onClick={onJoin} className={`w-full rounded-full py-4 text-sm font-semibold shadow-sm active:scale-95 transition ${joined ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-black text-white"}`}>
            {joined ? "Joined" : "Join and win badge"}
        </button>
    );
}
