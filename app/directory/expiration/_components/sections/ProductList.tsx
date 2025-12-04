import { ExpiringProduct } from "../ExpirationContent";
import ProductCard from "./ProductCard";

interface ProductListProps {
    products: ExpiringProduct[];
    onMoveToHistory: (id: string) => void;
    onSetReminder: (id: string) => void;
}

export default function ProductList({ products, onMoveToHistory, onSetReminder }: ProductListProps) {
    return (
        <div className="flex flex-col gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onMoveToHistory={onMoveToHistory} onSetReminder={onSetReminder} />
            ))}
        </div>
    );
}
