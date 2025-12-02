import Image from "next/image";
import { ProductItem } from "../GalleryContent";

interface ProductCardProps {
    product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="rounded-md bg-white border border-gray-200 overflow-hidden flex flex-col">
            <div className="relative w-full h-32 bg-gray-100">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
                {product.isNew && <span className="absolute top-2 right-2 text-[10px] bg-rose text-white px-2 py-0.5 rounded-full font-semibold">New</span>}
            </div>
            <div className="px-3 py-2 flex flex-col gap-0.5">
                <p className="text-base font-semibold leading-tight">{product.brand}</p>
                <p className="text-sm text-gray-700 leading-tight line-clamp-2">{product.name}</p>
                <span className="text-xs mt-1 inline-block text-gray-600 font-medium">{product.category}</span>
            </div>
        </div>
    );
}
