import { LuArrowLeft } from "react-icons/lu";

interface NavigationHeaderProps {
    title: string;
    onBack?: () => void;
    className?: React.ReactNode;
}

export default function NavigationHeader({ title, onBack, className }: NavigationHeaderProps) {
    return (
        <div className={`flex-between items-center gap-3 mb-6 pt-6 w-full ${className}`}>
            <button type="button" onClick={onBack} className="p-1 rounded hover:bg-gray-100">
                <LuArrowLeft className="text-xl text-woodsmoke" />
            </button>
            <h1 className="text-lg font-semibold">{title}</h1>
            <span />
        </div>
    );
}
