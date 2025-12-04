interface CircularProgressProps {
    percentage: number;
}

export default function CircularProgress({ percentage }: CircularProgressProps) {
    const radius = 45;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={normalizedRadius} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" />
                <circle cx="50" cy="50" r={normalizedRadius} stroke="#7C3AED" strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-500" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{percentage}%</span>
            </div>
        </div>
    );
}
