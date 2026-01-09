"use client";

import { CiPen } from "react-icons/ci";
import { useState, useEffect } from "react";

interface HomeModalProp {
    isOpen: boolean;
    onClose: () => void;
}

export default function HomeModal({ isOpen, onClose }: HomeModalProp) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    if (!isOpen && !isAnimating) return null;

    return (
        <div className={`fixed inset-0 z-100 flex items-end justify-center transition-colors duration-300 ${isAnimating ? "bg-black/50 backdrop-blur-lg" : "bg-transparent"}`} onClick={handleClose}>
            <div className={`w-full max-w-md rounded-t-3xl bg-linear-to-b from-[#F7F5FE] to-[#E8E7FC] p-6 pb-8 max-h-[90vh] overflow-y-auto transition-transform duration-300 ${isAnimating ? "translate-y-0" : "translate-y-full"}`} onClick={(e) => e.stopPropagation()}>
                <>
                    <h2 className="text-center text-2xl font-semibold mb-4">Create</h2>
                    <button onClick={() => (window.location.href = "/directory/product/add")} className="w-full mt-2 flex-center flex-row gap-2 rounded-full bg-white hover:bg-neutral-50 py-3 active:scale-[.97] transition">
                        <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                            <path
                                d="M8.25027 20.6001H1.24827L0.604393 8.12527C0.52391 6.83754 1.5702 5.79126 2.77744 5.79126H6.7211C8.00882 5.79126 8.97463 6.83754 8.89414 8.12527L8.25027 20.6001Z"
                                stroke={"#000"}
                                strokeWidth="1.2"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path d="M7.04301 2.65234H2.45551V5.87166H7.04301V2.65234Z" stroke={"#000"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.23818 17.2198H3.42128L2.61646 9.49341H6.96255L6.23818 17.2198Z" stroke={"#000"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8.33081 19.2319H16.3791V7.48138C16.3791 6.27414 15.4133 5.30835 14.2061 5.30835H10.7453C9.7795 5.30835 8.89419 5.95221 8.65274 6.91801" stroke={"#000"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.9303 5.30835H9.85986V0.962271C11.55 0.479373 13.2402 0.479373 14.9303 0.962271V5.30835Z" stroke={"#000"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.04301 2.65234H2.45551V5.87166H7.04301V2.65234Z" stroke={"#000"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.23818 17.2198H3.42128L2.61646 9.49341H6.96255L6.23818 17.2198Z" stroke={"#000"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8.33081 19.2319H16.3791V7.48138C16.3791 6.27414 15.4133 5.30835 14.2061 5.30835H10.7453C9.7795 5.30835 8.89419 5.95221 8.65274 6.91801" stroke={"#000"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.9303 5.30835H9.85986V0.962271C11.55 0.479373 13.2402 0.479373 14.9303 0.962271V5.30835Z" stroke={"#000"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>{" "}
                        Add Product
                    </button>
                    <button onClick={() => (window.location.href = "/feed/community/post/add")} className="w-full mt-2 flex-center flex-row gap-2 rounded-full bg-white hover:bg-neutral-50 py-3 active:scale-[.97] transition">
                        <CiPen className="text-2xl" /> Add Post
                    </button>
                </>
            </div>
        </div>
    );
}
