"use client";

import { ChangeEvent, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiChevronDown } from "react-icons/fi";

interface BottomSheetSelectProps {
    label: string;
    name: string;
    value: string;
    required?: boolean;
    options: string[];
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    className?: string;
}

export default function BottomSheetSelect({ label, name, value, options, required, onChange, className }: BottomSheetSelectProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-1 relative">
                <label className="text-xs font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <button type="button" onClick={() => setOpen(true)} className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-left">
                    {value || "Select..."}
                </button>

                <FiChevronDown className="absolute right-4 bottom-3 text-lg text-gray-500 pointer-events-none" />
            </div>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div className="fixed inset-0 bg-black/30 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />

                        <motion.div className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-5 pb-10 ${className}`} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 160, damping: 22 }}>
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

                            <h3 className="text-center text-sm font-semibold mb-3">{label}</h3>

                            <div className="flex flex-col divide-y border border-gray-200 rounded-xl overflow-hidden">
                                {options.map((opt) => (
                                    <span
                                        key={opt}
                                        className="text-left px-4 py-3 text-sm hover:bg-gray-50"
                                        onClick={() => {
                                            onChange({ target: { name, value: opt } } as ChangeEvent<HTMLInputElement | HTMLSelectElement>);
                                            setOpen(false);
                                        }}
                                    >
                                        {opt}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
