"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import EditProductImage from "./sections/EditProductImage";
import EditProductFields from "./sections/EditProductFields";
import EditActionButtons from "./sections/EditActionButtons";
import { LuArrowLeft } from "react-icons/lu";
import { addNotification } from "@/lib/notifications";

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

const colorOptions = [
    { id: "warm-nude", label: "Warm Nude", color: "#E4A38A" },
    { id: "baby-pink", label: "Baby Pink", color: "#F7C3C8" },
    { id: "rosy-pink", label: "Rosy Pink", color: "#D68086" },
    { id: "mauve", label: "Mauve", color: "#B07A8C" },
    { id: "hot-pink", label: "Hot Pink", color: "#E84571" },
    { id: "classic-red", label: "Classic Red", color: "#C2352A" },
    { id: "orange-coral", label: "Orange Coral", color: "#F28A5B" },
    { id: "terracotta", label: "Terracotta", color: "#C56548" },
    { id: "cocoa-brown", label: "Cocoa Brown", color: "#8A4B37" },
];

const productUsages = ["0% — Brand new", "25% — Lightly used", "50% — Half used", "75% — Mostly used", "100% — Empty"];

// Helper untuk normalize color value ke id
function normalizeColorValue(value: string | null | undefined): string {
    if (!value) return "";
    // Jika sudah adalah id valid, return as-is
    if (colorOptions.some((opt) => opt.id === value)) return value;
    // Jika label, cari dan return id-nya
    const found = colorOptions.find((opt) => opt.label === value);
    return found ? found.id : value;
}

// Helper untuk normalize usage percentage ke format dengan label
function normalizeUsageValue(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") return "";
    const percentage = Number(value);
    if (isNaN(percentage)) return String(value);
    // Find matching usage option
    const found = productUsages.find((usage) => usage.startsWith(percentage + "%"));
    return found || String(value);
}

export default function ProductEdit({ productId }: { productId: string }) {
    const [formData, setFormData] = useState<ProductFormData>({
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
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);

                const res = await fetch(`/api/items/${productId}`);

                if (!res.ok) throw new Error("Failed to fetch item");
                const json = await res.json();

                const item = json.data?.item;

                if (!item) {
                    throw new Error("Item data not found in response");
                }

                const newFormData = {
                    brand: item.brand || "",
                    name: item.name || "",
                    category: item.category || "",
                    price: item.price ? String(item.price) : "",
                    expirationDate: item.expiration_date ? item.expiration_date.split("T")[0] : "",
                    openingDate: item.opening_date ? item.opening_date.split("T")[0] : "",
                    periodAfterOpening: item.pao_months ? String(item.pao_months) : "",
                    currentlyInUse: item.is_currently_in_use ? "Yes" : "No",
                    usage: normalizeUsageValue(item.usage_percentage),
                    colorVariant: normalizeColorValue(item.color_variation),
                    rating: item.rating ? String(item.rating) : "",
                    status: item.status || "in-cabinet",
                    imageFile: null,
                    imagePreview: item.image_url || undefined,
                };

                setFormData(newFormData);
                setError(null);
            } catch (err) {
                console.error("Error fetching item:", err);
                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        if (productId) loadProduct();
    }, [productId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImage = (file: File | null, dataUrl?: string) => {
        if (!file && !dataUrl) return;
        setFormData((prev) => ({
            ...prev,
            imageFile: file ?? null,
            imagePreview: dataUrl ?? undefined,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const data = new FormData();
            data.append("brand", formData.brand);
            data.append("name", formData.name);
            data.append("category", formData.category);
            data.append("price", formData.price);
            data.append("expirationDate", formData.expirationDate);
            data.append("openingDate", formData.openingDate);
            data.append("paoMonths", formData.periodAfterOpening);
            data.append("isCurrentlyInUse", formData.currentlyInUse === "Yes" ? "true" : "false");
            // Extract usage percentage dari format "0% — Brand new" ke "0"
            const usageMatch = formData.usage.match(/^(\d+)/);
            const usagePercentage = usageMatch ? usageMatch[1] : formData.usage;
            data.append("usagePercentage", usagePercentage);
            data.append("colorVariation", formData.colorVariant);
            data.append("status", formData.status);
            if (formData.imageFile) {
                data.append("image", formData.imageFile);
            }
            const res = await fetch(`/api/items/${productId}`, {
                method: "PATCH",
                body: data,
            });
            const json = await res.json();

            if (!res.ok) throw new Error("Failed to update item");
            
            // Add notification for edit
            const updatedItem = json.data?.item;
            if (updatedItem) {
                addNotification(
                    "edited",
                    String(updatedItem.id),
                    updatedItem.name || formData.name,
                    updatedItem.brand || formData.brand,
                    updatedItem.image_url || formData.imagePreview
                );
            }
            
            window.location.href = "/directory";
        } catch (err) {
            console.error("Error updating item:", err);
            alert("Failed to update product");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-md mx-auto flex-center flex-col gap-6">
                <div className={`flex-between items-center gap-3 mb-6 pt-6 w-full`}>
                    <button type="button" onClick={() => window.history.back()} className="p-1 rounded hover:bg-gray-100">
                        <LuArrowLeft className="text-xl text-woodsmoke" />
                    </button>
                    <h1 className="text-lg font-semibold">Edit Product</h1>
                    <div className="w-6" />
                </div>
                <div className="text-center text-gray-500 py-20">Loading product...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-md mx-auto flex items-center justify-center min-h-screen">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    const requiredFilled = [formData.brand, formData.name, formData.category, formData.price, formData.expirationDate, formData.openingDate, formData.periodAfterOpening, formData.currentlyInUse, formData.usage].every((v) => String(v).trim() !== "");

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-6">
            <div className={`flex-between items-center gap-3 mb-6 pt-6 w-full`}>
                <button type="button" onClick={() => window.history.back()} className="p-1 rounded hover:bg-gray-100">
                    <LuArrowLeft className="text-xl text-woodsmoke" />
                </button>
                <h1 className="text-lg font-semibold">Edit Product</h1>
                <div className="w-6" />
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-20">Loading product...</div>
            ) : (
                <>
                    <EditProductImage imagePreview={formData.imagePreview} onImageChange={handleImage} />
                    <EditProductFields data={formData} onChange={handleChange} />
                    <EditActionButtons isEnabled={requiredFilled && !submitting} isSubmitting={submitting} />
                </>
            )}
        </form>
    );
}
