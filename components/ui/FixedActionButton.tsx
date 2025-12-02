interface FixedActionButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
}

export function FixedActionButton({ onClick, children }: FixedActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed left-1/2 -translate-x-1/2 bottom-[88px] md:bottom-[90px] w-[calc(100%-3rem)] max-w-md bg-black text-white rounded-full py-3 text-sm font-medium transition active:scale-[.98] hover:bg-gray-900"
        >
            {children}
        </button>
    );
}
