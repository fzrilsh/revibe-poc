"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { LuPlus } from "react-icons/lu";
import { HiUser } from "react-icons/hi";

const SKIN_TYPES = [
    { value: "OILY", label: "Oily Skin" },
    { value: "DRY", label: "Dry Skin" },
    { value: "COMBINATION", label: "Combination" },
    { value: "SENSITIVE", label: "Sensitive" },
    { value: "NORMAL", label: "Normal" },
];

const SKIN_CONCERNS = ["Cracking", "Hyperpigmentation", "Dark circles", "Dark spots", "Dullness", "Large pores", "Wrinkle/Aging", "Uneven tone", "Acne-prone", "Sensitive"];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

const genderOptions = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
];

export default function EditProfileForm() {
    const currentYear = new Date().getFullYear();
    const [formData, setFormData] = useState({
        nickname: "",
        birthYear: currentYear - 25,
        skinType: "",
        skinConcerns: [] as string[],
        gender: "",
    });
    const [profileImage, setProfileImage] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const json = await res.json();
                    const user = json.data?.user;
                    console.log("Fetched user:", user);
                    if (user) {
                        setFormData({
                            nickname: user.nickname || "",
                            birthYear: user.birth_year || currentYear - 25,
                            skinType: user.skin_type || "",
                            skinConcerns: (user.skin_concerns as Array<{ name: string }>)?.map((c) => c.name) || [],
                            gender: user.gender || "",
                        });
                        setProfileImage(user.profile_image || "/community/profile/avatar1.svg");
                    }
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [currentYear]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleSkinConcern = (concern: string) => {
        setFormData((prev) => ({
            ...prev,
            skinConcerns: prev.skinConcerns.includes(concern) ? prev.skinConcerns.filter((c) => c !== concern) : [...prev.skinConcerns, concern],
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const sendFormData = new FormData();
            sendFormData.append("nickname", formData.nickname);
            sendFormData.append("birth_year", String(formData.birthYear));
            sendFormData.append("skin_type", formData.skinType);
            sendFormData.append("gender", formData.gender);
            sendFormData.append("skin_concerns", JSON.stringify(formData.skinConcerns));

            if (imageFile) {
                sendFormData.append("profile_image", imageFile);
            }

            const res = await fetch("/api/auth/me", {
                method: "PATCH",
                body: sendFormData,
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "Failed to update profile");
            }

            alert("Profile updated successfully!");
            window.history.back();
        } catch (err) {
            console.error("Error saving profile:", err);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading profile...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-2">
                <label className="relative cursor-pointer group" htmlFor="profile_image">
                    <div className="w-24 h-24 rounded-full bg-[#EFEFEF] flex items-center justify-center group-hover:border-[#958FFA] transition relative overflow-hidden">
                        {profileImage ? <Image src={profileImage} alt="Profile" fill className="object-cover" /> : <HiUser className="text-5xl text-[#D4D4D4]" />}
                    </div>

                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-gray-300 group-hover:border-[#958FFA] transition">
                        <LuPlus className="text-white" />
                    </div>
                </label>

                <input id="profile_image" type="file" accept="image/*;capture=camera" className="hidden" onChange={handleImageChange} />
                <span className="text-sm text-gray-600 mt-4">Tambahkan foto profil</span>
            </div>

            {/* Nickname */}
            <div>
                <input type="text" name="nickname" value={formData.nickname} onChange={handleInputChange} className="w-full px-5 py-4 rounded-3xl border-2 border-gray-300 focus:border-[#958FFA] focus:outline-none transition" placeholder="Nickname*" required />
            </div>

            <div>
                <select value={formData.gender} onChange={handleInputChange} id="gender" name="gender" className="w-full px-5 py-4 rounded-3xl border-2 border-gray-300 focus:border-[#958FFA] focus:outline-none transition appearance-none bg-white cursor-pointer">
                    <option value="" disabled>
                        Gender
                    </option>
                    {genderOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Birth Year */}
            <div>
                {/* <input type="number" name="birthYear" value={formData.birthYear} onChange={handleInputChange} className="w-full px-5 py-4 rounded-3xl border-2 border-gray-300 focus:border-[#958FFA] focus:outline-none transition" placeholder="Enter birth year" /> */}

                <select value={formData.birthYear} onChange={handleInputChange} id="birthYear" name="birthYear" className="w-full px-5 py-4 rounded-3xl border-2 border-gray-300 focus:border-[#958FFA] focus:outline-none transition appearance-none bg-white cursor-pointer">
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

            {/* Skin Type */}
            <div>
                <label className="block text-sm font-medium mb-3">Select skin type</label>
                <div className="grid grid-cols-3 gap-2 w-full">
                    {SKIN_TYPES.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, skinType: type.value }))}
                            className={`px-2 py-2 rounded-full border text-sm font-medium transition ${formData.skinType === type.value ? "bg-black text-white border-black" : "bg-white text-gray-800 border-gray-300 hover:border-[#958FFA]"}`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Skin Concerns */}
            <div>
                <label className="block text-sm font-medium mb-3">Select skin concern</label>
                <div className="grid grid-cols-2 gap-2">
                    {SKIN_CONCERNS.map((concern) => (
                        <button
                            key={concern}
                            type="button"
                            onClick={() => toggleSkinConcern(concern)}
                            className={`px-2 py-2 rounded-full border text-sm font-medium transition ${formData.skinConcerns.includes(concern) ? "bg-black text-white border-black" : "bg-white text-gray-800 border-gray-300 hover:border-[#958FFA]"}`}
                        >
                            {concern}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={saving} className="w-full bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 transition">
                {saving ? "Applying Changes..." : "Apply Changes"}
            </button>
        </form>
    );
}
