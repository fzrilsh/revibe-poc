import { ProductItem } from "../GalleryContent";
import ProductCard from "./ProductCard";

interface GalleryGridProps {
  products: ProductItem[];
}

export default function GalleryGrid({ products }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
