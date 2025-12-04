interface ProgressBarProps {
    current: number;
    total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
    const progressPercent = ((current + 1) / total) * 100;

    return (
        <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
            <div className="h-full bg-chetwode-blue transition-all duration-300 ease-in-out" style={{ width: `${progressPercent}%` }} />
        </div>
    );
}
