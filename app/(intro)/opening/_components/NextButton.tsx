import { LuArrowRight } from "react-icons/lu";

interface NextButtonProps {
    onClick: () => void;
}

export function NextButton({ onClick }: NextButtonProps) {
    return (
        <div onClick={onClick} className="w-16 h-16 bg-black hover:bg-neutral-900 p-2 rounded-full flex-center mt-auto cursor-pointer transition-colors">
            <LuArrowRight className="text-2xl rounded-full flex-center text-white" />
        </div>
    );
}
