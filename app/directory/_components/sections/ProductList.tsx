import { FixedActionButton } from "@ui/FixedActionButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdStar } from "react-icons/io";

interface Product {
    id: string;
    brand: string;
    name: string;
    type: string;
    category: string;
    image: string;
    rating?: number;
}

interface ProductListProps {
    products: Product[];
}

export function ProductList({ products }: ProductListProps) {
    const router = useRouter();
    
    const onAddProduct = () => {
        router.push("/directory/product/add");
    };

    const onProductClick = (id: string) => {
        router.push(`/directory/product/detail?id=${id}`);
    };

    return (
        <div className="flex flex-col gap-4 w-full pb-4">
            {products.map((p) => (
                <div key={p.id} onClick={() => onProductClick(p.id)} className="cursor-pointer relative flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-semibold leading-tight capitalize">{p.brand}</p>
                        <p className="text-[12px] text-gray-700 leading-tight">{p.name}</p>
                        <p className="text-[11px] text-gray-400 leading-tight">{p.type}</p>
                    </div>
                    {p.rating && (
                        <span className="absolute top-2 right-2 text-[10px] flex-center flex-row gap-1 bg-gray-100 rounded-full px-1">
                            {p.rating}
                            <IoMdStar className="text-bright-sun" />
                        </span>
                    )}
                </div>
            ))}

            <FixedActionButton onClick={onAddProduct}>Add a product</FixedActionButton>
        </div>
    );
}
