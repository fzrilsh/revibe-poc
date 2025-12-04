import Image from "next/image";
import { FaTrophy } from "react-icons/fa";


interface ChallengeCardProps {
    challenge: {
        id: string;
        title: string;
        participants: number;
        excerpt: string;
        image: string;
    };
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
    return (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
            <div className="relative w-full h-32">
                <Image src={challenge.image} alt={challenge.title} fill className="object-cover" />
                <span className="absolute top-2 right-2 text-[10px] bg-black/70 text-white px-2 py-1 rounded-full flex-center flex-row gap-1"><FaTrophy className="text-white"/> Get Badge</span>
            </div>
            <div className="p-4 flex flex-col gap-2">
                <span className="text-sm text-chetwode-blue font-medium">{challenge.participants}+ people have participated</span>
                <h3 className="text-lg font-semibold leading-snug">{challenge.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{challenge.excerpt}</p>
                <div className="pt-2">
                    <span className="inline-block rounded-full bg-black text-white text-xs px-4 py-2 font-medium group-active:scale-[.97] transition">View more</span>
                </div>
            </div>
        </div>
    );
}
