interface ChallengeTipsProps {
    tips: string[];
}

export default function ChallengeTips({ tips }: ChallengeTipsProps) {
    return (
        <div className="mb-8">
            <p className="text-sm font-semibold mb-3">Tips from REVIBE team:</p>
            <ul className="flex flex-col gap-2 text-[13px] text-gray-700">
                {tips.map((tip: string, i: number) => (
                    <li key={i} className="flex gap-2">
                        <span>💡</span>
                        <span>{tip}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
