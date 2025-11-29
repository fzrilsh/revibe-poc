"use client";

import { useState } from "react";
import Image from "next/image";
import { LuUser, LuPlus } from "react-icons/lu";
import { StepProps } from "@type/onboarding";

export type StepData = {
    photo: string | null;
    nickname: string;
    gender: string;
    birthYear: string;
    file?: File | null;
};

const genderOptions = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

export function ProfileSetupStep({ onNext }: StepProps<StepData>) {
    const [photo, setPhoto] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [nickname, setNickname] = useState("");
    const [gender, setGender] = useState("");
    const [birthYear, setBirthYear] = useState("");

    const isValid = nickname.trim() !== "" && gender !== "" && birthYear !== "";

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleContinue = () => {
        if (isValid) {
            onNext({ photo, nickname, gender, birthYear, file });
        }
    };

    return (
        <div className="max-w-md mx-auto w-full h-full flex flex-col gap-8">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl max-w-xs font-bold leading-snug text-woodsmoke">Now let&apos;s get to know you better!</h1>
            </div>

            <div className="flex flex-col w-full h-full gap-6">
                <div className="flex flex-col items-center gap-2">
                    <label className="relative cursor-pointer group">
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center group-hover:border-[#958FFA] transition relative overflow-hidden">{photo ? <Image src={photo} alt="Profile" className="object-cover" fill /> : <LuUser className="text-4xl text-black" />}</div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-gray-300 group-hover:border-[#958FFA] transition">
                            <LuPlus className="text-gray-600" />
                        </div>
                    </label>
                    <span className="text-sm text-gray-600">Add a photo</span>
                </div>

                <div className="flex flex-col w-full gap-4">
                    <input type="text" placeholder="Nickname *" value={nickname} id="nickname" name="nickname" onChange={(e) => setNickname(e.target.value)} className="w-full px-5 py-4 rounded-3xl border-2 border-gray-300 focus:border-[#958FFA] focus:outline-none transition" />

                    <select value={gender} onChange={(e) => setGender(e.target.value)} id="gender" name="gender" className="w-full px-5 py-4 rounded-3xl border-2 border-gray-300 focus:border-[#958FFA] focus:outline-none transition appearance-none bg-white cursor-pointer">
                        <option value="" disabled>
                            Select option
                        </option>
                        {genderOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} id="birthYear" name="birthYear" className="w-full px-5 py-4 rounded-3xl border-2 border-gray-300 focus:border-[#958FFA] focus:outline-none transition appearance-none bg-white cursor-pointer">
                        <option value="" disabled>
                            Birth year
                        </option>
                        {yearOptions.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={handleContinue} disabled={!isValid} className="w-full py-4 mt-auto rounded-full bg-black text-white text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition">
                    Continue
                </button>
            </div>
        </div>
    );
}
