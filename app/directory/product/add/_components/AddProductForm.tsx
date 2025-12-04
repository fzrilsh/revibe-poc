"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import ImageUpload from "./sections/ImageUpload";
import ProductFields from "./sections/ProductFields";
import SubmitButton from "./sections/SubmitButton";
import NavigationHeader from "@features/NavigationHeader";

interface ProductFormData {
    brand: string;
    name: string;
    category: string;
    price: string;
    expirationDate: string;
    openingDate: string;
    periodAfterOpening: string;
    currentlyInUse: string;
    usage: string;
    colorVariant: string;
    rating: string;
    status: string;
    imageFile?: File | null;
    imagePreview?: string;
}

export default function AddProductForm({ onBack }: { onBack?: () => void }) {
    const [data, setData] = useState<ProductFormData>({
        brand: "",
        name: "",
        category: "",
        price: "",
        expirationDate: "",
        openingDate: "",
        periodAfterOpening: "",
        currentlyInUse: "",
        usage: "",
        colorVariant: "",
        rating: "",
        status: "in-cabinet",
        imageFile: null,
        imagePreview: undefined,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setData((prev) => ({ ...prev, imageFile: file, imagePreview: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const requiredFilled = [data.brand, data.name, data.category, data.price, data.expirationDate, data.openingDate, data.periodAfterOpening, data.currentlyInUse, data.usage].every((v) => v.trim() !== "");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!requiredFilled) return;
        
        try {
            const formData = new FormData();
            formData.append('brand', data.brand);
            formData.append('name', data.name);
            formData.append('category', data.category);
            formData.append('price', data.price);
            formData.append('expirationDate', data.expirationDate);
            formData.append('openingDate', data.openingDate);
            formData.append('paoMonths', data.periodAfterOpening);
            formData.append('isCurrentlyInUse', data.currentlyInUse === 'Yes' ? 'true' : 'false');
            formData.append('usagePercentage', data.usage);
            formData.append('colorVariation', data.colorVariant);
            formData.append('status', data.status);
            
            if (data.imageFile) {
                formData.append('image', data.imageFile);
            }
            
            const res = await fetch('/api/items', {
                method: 'POST',
                body: formData,
            });
            
            if (!res.ok) {
                throw new Error('Failed to create item');
            }
            
            const json = await res.json();
            console.log('Item created:', json.data?.item);
            
            // Redirect back or show success
            if (onBack) onBack();
            else window.location.href = '/directory';
        } catch (err) {
            console.error('Error creating item:', err);
            alert('Failed to create item');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-6">
            {/* Title + Back */}
            <NavigationHeader title={"Add Product"} onBack={onBack} />

            <ImageUpload imagePreview={data.imagePreview} onImageChange={handleImage} />

            <ProductFields data={data} onChange={handleChange} />

            <SubmitButton isEnabled={requiredFilled} />
        </form>
    );
}
