import { LuArrowRight } from "react-icons/lu";
import { motion } from "motion/react";

interface NextButtonProps {
    onClick: () => void;
}

export function NextButton({ onClick }: NextButtonProps) {
    return (
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="mt-auto">
            <div onClick={onClick} className="w-16 h-16 bg-black hover:bg-neutral-900 p-2 rounded-full flex-center cursor-pointer transition-colors">
                <LuArrowRight className="text-2xl rounded-full flex-center text-white" />
            </div>
        </motion.div>
    );
}
