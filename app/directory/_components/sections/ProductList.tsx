import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { LuPlus } from "react-icons/lu";

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
        <div className="flex flex-col gap-4 mt-4 w-full pb-4">
            <div className="grid grid-cols-2 gap-4">
                {products.map((p) => (
                    <ProductCard onProductClick={onProductClick} key={p.id} product={p} />
                ))}
            </div>

            <button onClick={onAddProduct} className="fixed right-10 bottom-24 bg-black p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors">
                <LuPlus className="text-2xl text-white" />
            </button>
        </div>
    );
}
