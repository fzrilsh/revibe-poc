import { IoCalendarOutline } from "react-icons/io5";

interface StatCard {
    label: string;
    value: number;
}

const stats: StatCard[] = [
    { label: "Yearly", value: 12 },
    { label: "Monthly", value: 2 },
    { label: "Weekly", value: 1 },
];

export default function StatsGrid() {
    return (
        <div className="grid grid-cols-3 gap-2 mb-6 px-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex-start flex-col shadow-sm">
                    <div className="w-12 h-12 rounded-lg mb-3 flex">
                        <span className="text-2xl">
                            <IoCalendarOutline />
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
