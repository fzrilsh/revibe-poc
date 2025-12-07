interface ProductData {
    price: number;
    expirationDate: string;
    openingDate: string;
    periodAfterOpening: string;
    currentlyInUse: string;
    usage: string;
    category: string;
    colorVariant: string;
}

interface ProductInfoProps {
    product: ProductData;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    return (
        <div className="grid grid-cols-2 gap-3 mb-6 w-full">
            <InfoRow label="Category" value={product.category} />
            <InfoRow label="Price" value={`Rp. ${product.price.toLocaleString("id-ID")}`} />
            <InfoRow className="col-span-2" label="Expiration date" value={product.expirationDate} />
            <InfoRow label="Opening date" value={product.openingDate} />
            <InfoRow label="Period after opening" value={product.periodAfterOpening} />
            <InfoRow className="col-span-2" label="Currently in use" value={product.currentlyInUse} />
            <InfoRow className="col-span-2" label="Product usage" value={product.usage} />
            <InfoRow className="col-span-2" label="Select Color Variation" value={product.colorVariant} />
        </div>
    );
}

function InfoRow({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <div className={`flex flex-col text-sm w-full gap-2 ${className}`}>
            <span className="text-gray-600 font-medium">{label}</span>
            <span className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm">{value}</span>
        </div>
    );
}
