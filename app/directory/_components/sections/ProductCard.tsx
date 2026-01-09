import Image from "next/image";
import { FaCalendar } from "react-icons/fa";

interface Product {
    id: string;
    brand: string;
    name: string;
    type: string;
    category: string;
    image: string;
    rating?: number;
    isNew?: boolean;
    daysLeft: number;
}

interface ProductCardProps {
    product: Product;
    onProductClick: (id: string) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
    return (
        <div onClick={() => onProductClick(product.id)} className="rounded-md bg-white border border-gray-200 overflow-hidden flex flex-col cursor-pointer">
            <div className="relative w-full h-32 bg-gray-100">
                <Image src={product.image} alt={product.name} fill className="object-cover" />

                {/* BADGE WRAPPER */}
                <div className="absolute top-2 right-2 flex gap-2">
                    {product.isNew && <span className="text-[10px] bg-rose text-white px-2 py-0.5 rounded-full font-semibold flex-center">New</span>}

                    {product.daysLeft && (
                        <div className="flex items-center gap-1 bg-remy text-cerise-red text-[10px] font-bold px-2 py-1 rounded-full">
                            <FaCalendar /> <span>{product.daysLeft}d</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-3 py-2 flex flex-col gap-0.5">
                <p className="text-base font-semibold leading-tight">{product.brand}</p>
                <p className="text-sm text-gray-700 leading-tight line-clamp-2">{product.name}</p>
                <span className="text-xs mt-1 inline-block text-gray-600 font-medium">{product.category}</span>
            </div>
        </div>
    );
}
