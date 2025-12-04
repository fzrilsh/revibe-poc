"use client";

import { useState, useEffect } from "react";
import NavigationHeader from "@features/NavigationHeader";
import ProductImage from "./sections/ProductImage";
import ProductHeader from "./sections/ProductHeader";
import ProductInfo from "./sections/ProductInfo";
import ActionButtons from "./sections/ActionButtons";
import ShareModal from "./sections/ShareModal";

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
    rating: number;
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
                    throw new Error('Failed to fetch item');
                }
                const json = await res.json();
                const item = json.data?.item;
                
                setProduct({
                    id: String(item.id),
                    brand: item.brand || 'Unknown',
                    name: item.name || 'Unnamed',
                    category: item.category || 'Skincare',
                    price: item.price || 0,
                    expirationDate: item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : 'N/A',
                    openingDate: item.opening_date ? new Date(item.opening_date).toLocaleDateString() : 'N/A',
                    periodAfterOpening: item.pao_months ? `${item.pao_months}M` : 'N/A',
                    currentlyInUse: item.is_currently_in_use ? 'Yes' : 'No',
                    usage: item.usage_percentage ? `${item.usage_percentage}%` : '0%',
                    image: item.image_url || '/products/placeholder.svg',
                    rating: item.rating || 0,
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching item:', err);
                setError('Failed to load item');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [productId]);

    const handleRemove = async () => {
        if (!confirm('Are you sure you want to remove this item?')) return;
        try {
            const res = await fetch(`/api/items/${productId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete item');
            if (onBack) onBack();
            else window.location.href = '/directory';
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Failed to delete item');
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
                <div className="text-center text-red-500">{error || 'Product not found'}</div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-md mx-auto flex-center flex-col">
                <NavigationHeader title={product.category} onBack={onBack} />

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
                    rating: product.rating,
                }}
            />
        </>
    );
}
