import Image from "next/image";

interface BlogHeroImageProps {
    src: string;
    alt: string;
}

export default function BlogHeroImage({ src, alt }: BlogHeroImageProps) {
    return (
        <div className="relative w-full h-40 bg-linear-to-br from-purple-200 to-blue-200 rounded-2xl overflow-hidden mb-4">
            <Image src={src} alt={alt} fill className="object-cover" />
        </div>
    );
}
