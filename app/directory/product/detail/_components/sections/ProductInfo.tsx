interface ProductData {
    price: number;
    expirationDate: string;
    openingDate: string;
    periodAfterOpening: string;
    currentlyInUse: string;
    usage: string;
}

interface ProductInfoProps {
    product: ProductData;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    return (
        <div className="flex flex-col gap-3 mb-6 w-full">
            <InfoRow label="Price" value={`Rp. ${product.price.toLocaleString("id-ID")}`} />
            <InfoRow label="Expiration date" value={product.expirationDate} />
            <InfoRow label="Opening date" value={product.openingDate} />
            <InfoRow label="Period after opening" value={product.periodAfterOpening} />
            <InfoRow label="Currently in use" value={product.currentlyInUse} />
            <InfoRow label="Product usage" value={product.usage} />
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-2 items-center text-sm">
            <span className="text-gray-600 font-medium">{label}</span>
            <span className="text-black text-center bg-white rounded-full px-2 py-1">{value}</span>
        </div>
    );
}
