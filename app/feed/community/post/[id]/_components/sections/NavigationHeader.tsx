import { LuArrowLeft } from "react-icons/lu";

interface NavigationHeaderProps {
    title: string;
}

export default function NavigationHeader({ title }: NavigationHeaderProps) {
    return (
        <div className="flex-between items-center w-full mb-4 px-6">
            <button onClick={() => window.history.back()}>
                <LuArrowLeft className="text-2xl" />
            </button>
            <h2 className="text-xl font-semibold">{title}</h2>
            <span />
        </div>
    );
}
