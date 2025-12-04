interface ChallengeInfoProps {
    title: string;
    participants: number;
    description: string;
}

export default function ChallengeInfo({ title, participants, description }: ChallengeInfoProps) {
    return (
        <>
            <span className="text-[11px] text-blue-600 font-medium mb-2 block">{participants}+ people have participated</span>
            <h2 className="text-xl font-bold mb-4 leading-snug">{title}</h2>
            <p className="text-[13px] text-gray-700 mb-6 leading-relaxed">{description}</p>
        </>
    );
}
