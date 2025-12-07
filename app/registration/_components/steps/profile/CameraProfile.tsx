"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HiUser } from "react-icons/hi2";
import { LuPlus } from "react-icons/lu";

interface CameraProfileProps {
    onImageChange?: (file: File | null, preview: string | null) => void;
}

export default function CameraProfile({ onImageChange }: CameraProfileProps) {
    const [photo, setPhoto] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const url = URL.createObjectURL(selectedFile);
        setPhoto(url);
        onImageChange?.(selectedFile, url);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <label className="relative cursor-pointer group" htmlFor="profile_image">
                <div className="w-24 h-24 rounded-full bg-[#EFEFEF] flex items-center justify-center group-hover:border-[#958FFA] transition relative overflow-hidden">
                    {photo ? (
                        <Image src={photo} alt="Profile" fill className="object-cover" />
                    ) : (
                        <HiUser className="text-5xl text-[#D4D4D4]" />
                    )}
                </div>

                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-gray-300 group-hover:border-[#958FFA] transition">
                    <LuPlus className="text-white" />
                </div>
            </label>

            <input id="profile_image" type="file" accept="image/*;capture=camera" className="hidden" onChange={handleFileChange} />
            <span className="text-sm text-gray-600 mt-4">Tambahkan foto profil</span>
        </div>
    );
}
