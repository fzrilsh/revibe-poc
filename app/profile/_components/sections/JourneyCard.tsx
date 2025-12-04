interface JourneyProps {
    directory: number;
    budget: number;
    goals: number;
    badges: string[];
}

export default function JourneyCard({ directory, budget, goals, badges }: JourneyProps) {
    return (
        <div className=" px-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold mb-2">
                    Your Beauty Journey <span className="text-gray-400 font-normal">(Coming Soon)</span>
                </h3>
                <div className="space-y-4 mt-4">
                    <ProgressRow label="Directory management" value={directory} />
                    <ProgressRow label="Budget spent" value={budget} barColor="bg-black" />
                    <ProgressRow label="Goals progress" value={goals} />
                </div>
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-6">
                    {badges.map((b, i) => (
                        <span key={i} className="text-[11px] px-3 py-1 rounded-md bg-purple-600 text-white font-medium flex items-center gap-1 shadow-sm">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L10 14.77l-4.78 2.15.91-5.32L2.27 7.62l5.34-.78L10 2z" />
                            </svg>
                            {b}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ProgressRowProps {
    label: string;
    value: number;
    barColor?: string;
}

function ProgressRow({ label, value, barColor = "bg-purple-600" }: ProgressRowProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-gray-700 font-medium">{label}</p>
                <p className="text-xs font-semibold">{value}%</p>
            </div>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div className={`h-full ${barColor} rounded-full`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
