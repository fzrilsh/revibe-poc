import { LuArrowLeft } from "react-icons/lu";

interface NavigationHeaderProps {
    title: string;
}

export default function NavigationHeader({ title }: NavigationHeaderProps) {
    return (
        <div className="flex-between items-center gap-3 mb-6 pt-6 w-full">
            <button type="button" onClick={() => window.history.back()} className="p-1 rounded hover:bg-gray-100">
                <LuArrowLeft className="text-xl" />
            </button>
            <h1 className="text-lg font-semibold">{title}</h1>
            <span className="w-5"/>
        </div>
    );
}
