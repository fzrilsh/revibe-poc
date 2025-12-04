import Image from "next/image";

interface ChallengeImageProps {
    image: string;
    title: string;
}

export default function ChallengeImage({ image, title }: ChallengeImageProps) {
    return (
        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-5 bg-gray-100">
            <Image src={image} alt={title} fill className="object-cover" />
        </div>
    );
}
