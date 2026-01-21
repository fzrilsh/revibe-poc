"use client";

import { useState, useEffect } from "react";
import ProductImage from "./sections/ProductImage";
import ProductHeader from "./sections/ProductHeader";
import ProductInfo from "./sections/ProductInfo";
import ActionButtons from "./sections/ActionButtons";
import ShareModal from "./sections/ShareModal";
import { LuArrowLeft } from "react-icons/lu";
import { RiEdit2Line } from "react-icons/ri";
import { addNotification } from "@/lib/notifications";

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

function getColorLabel(colorId: string | null | undefined): string {
    if (!colorId) return "None";
    const found = colorOptions.find(opt => opt.id === colorId);
    return found ? found.label : colorId;
}

interface ProductData {
    id: string;
    brand: string;
    name: string;
    category: string;
    price: number;
    expirationDate: string;
    openingDate: string;
    periodAfterOpening: string;
    currentlyInUse: string;
    usage: string;
    image: string;
    colorVariant: string;
}

export default function ProductDetail({ productId, onBack }: { productId: string; onBack?: () => void }) {
    const [showShareModal, setShowShareModal] = useState(false);
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/items/${productId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch item");
                }
                const json = await res.json();
                const item = json.data?.item;

                setProduct({
                    id: String(item.id),
                    brand: item.brand || "Unknown",
                    name: item.name || "Unnamed",
                    category: item.category || "Skincare",
                    price: item.price || 0,
                    expirationDate: item.expiration_date ? new Date(item.expiration_date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "N/A",

                    openingDate: item.opening_date ? new Date(item.opening_date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "N/A",
                    periodAfterOpening: item.pao_months ? `${item.pao_months} months` : "N/A",
                    currentlyInUse: item.is_currently_in_use ? "Yes" : "No",
                    usage: item.usage_percentage ? `${item.usage_percentage}%` : "0%",
                    image: item.image_url || "/products/placeholder.svg",
                    colorVariant: getColorLabel(item.color_variation),
                });
                setError(null);
            } catch (err) {
                console.error("Error fetching item:", err);
                setError("Failed to load item");
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [productId]);

    const handleRemove = async () => {
        try {
            // Add notification before deleting
            if (product) {
                addNotification(
                    "deleted",
                    product.id,
                    product.name,
                    product.brand,
                    product.image
                );
            }

            const res = await fetch(`/api/items/${productId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete item");
            if (onBack) onBack();
            else window.location.href = "/directory";
        } catch (err) {
            console.error("Error deleting item:", err);
            alert("Failed to delete item");
        }
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    if (loading) {
        return (
            <div className="w-full max-w-md mx-auto flex items-center justify-center min-h-screen">
                <div className="text-center text-gray-500">Loading product...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="w-full max-w-md mx-auto flex items-center justify-center min-h-screen">
                <div className="text-center text-red-500">{error || "Product not found"}</div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-md mx-auto flex-center flex-col">
                <div className={`flex-between items-center gap-3 mb-6 pt-6 w-full`}>
                    <button type="button" onClick={onBack} className="p-1 rounded hover:bg-gray-100">
                        <LuArrowLeft className="text-xl text-woodsmoke" />
                    </button>
                    <h1 className="text-lg font-semibold">Product</h1>
                    <button type="button" onClick={()=> window.location.href = `/directory/product/edit/${product.id}`} className="p-1 rounded hover:bg-gray-100">
                        <RiEdit2Line className="text-xl text-woodsmoke" />
                    </button>
                </div>

                <ProductImage image={product.image} name={product.name} />

                <ProductHeader name={product.name} brand={product.brand} />

                <ProductInfo product={product} />

                <ActionButtons onRemove={handleRemove} onShare={handleShare} />
            </div>

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                product={{
                    name: product.name,
                    image: product.image,
                    colorVariant: product.colorVariant,
                }}
            />
        </>
    );
}
