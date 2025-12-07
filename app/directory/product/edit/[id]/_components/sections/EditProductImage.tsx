import Image from "next/image";
import { useState } from "react";
import { LuCamera } from "react-icons/lu";

interface EditProductImageProps {
    imagePreview?: string;
    onImageChange: (file: File | null, dataUrl?: string) => void;
}

export default function EditProductImage({ imagePreview, onImageChange }: EditProductImageProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            onImageChange(file, reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            onImageChange(file, reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex justify-center">
            <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative w-40 h-40 flex-center aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    isDragging ? "bg-blue-100 border-2 border-blue-500" : "bg-gray-100 border-2 border-transparent hover:bg-gray-200"
                }`}
            >
                {imagePreview ? (
                    <Image src={imagePreview} alt="Product preview" fill className="object-cover" />
                ) : (
                    <div className="flex-center flex-col gap-2 text-gray-400">
                        <LuCamera className="text-4xl" />
                        <span className="text-sm">Change image</span>
                    </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
        </div>
    );
}
