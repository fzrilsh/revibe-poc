import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";

const challenges = [
    {
        id: "minimalist-30",
        title: "30 Days\nMinimalist",
        img: "/home/challenge/minimalist.svg",
    },
    {
        id: "skin-fasting-14",
        title: "14 Days Skin\nFasting",
        img: "/home/challenge/skin_fasting.svg",
    },
    {
        id: "minimalist-5",
        title: "5 Days\nMinimalist",
        img: "/home/challenge/minimalist.svg",
    },
];

export function ChallengeSection() {
    return (
        <div className="flex-start gap-3 flex-col w-full overflow-hidden">
            <h2 className="font-semibold">Ongoing challenge</h2>
            <div className="flex gap-4 w-full overflow-x-auto scrollbar-none scrollbar-hide pb-2">
                {challenges.map((c) => (
                    <div key={c.id} className="relative min-w-60 h-[120px] rounded-2xl p-4 flex flex-col justify-between text-white bg-white overflow-hidden">
                        <div className="z-20">
                            {c.title.split("\n").map((line, i) => (
                                <h3 key={i} className="font-semibold leading-snug">
                                    {line}
                                </h3>
                            ))}
                        </div>
                        <button className="z-20 self-start bg-white text-black text-sm px-2 py-1 rounded-full flex items-center gap-1 border-2 border-gray-300">
                            See more <FaChevronRight className="text-xs" />
                        </button>
                        <div className="bg-linear-to-r w-full h-full top-0 left-0 from-black/50 to-black/0 absolute z-10" />
                        <Image src={c.img} alt={c.title.replace(/\n/g, " ")} width={160} height={140} className="absolute w-full h-full right-0 top-0 object-cover pointer-events-none select-none" />
                    </div>
                ))}
            </div>
        </div>
    );
}
