import Image from "next/image";

interface ProductImageProps {
    image: string;
    name: string;
}

export default function ProductImage({ image, name }: ProductImageProps) {
    return (
        <div className="relative w-40 h-40 flex-center aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-6">
            <Image src={image} alt={name} fill className="object-cover" />
        </div>
    );
}
