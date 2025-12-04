import Link from "next/link";
import ChallengeCard from "./ChallengeCard";

interface ChallengeItem {
    id: string;
    title: string;
    days: number;
    participants: number;
    excerpt: string;
    image: string;
}

interface ChallengeListProps {
    challenges: ChallengeItem[];
}

export default function ChallengeList({ challenges }: ChallengeListProps) {
    return (
        <div className="flex flex-col gap-5">
            {challenges.map((c) => (
                <Link href={`/activity/challenge/${c.id}`} key={c.id} className="group block">
                    <ChallengeCard challenge={c} />
                </Link>
            ))}
        </div>
    );
}
