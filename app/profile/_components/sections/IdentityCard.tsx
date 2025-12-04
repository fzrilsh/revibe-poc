import Image from "next/image";

interface SkinType { label: string; active: boolean }
interface Stats { products: number; reviews: number; challenge: number }
interface UserIdentityProps {
    name: string;
    image: string;
    role: string;
    skinTypes: SkinType[];
    stats: Stats;
}

export default function IdentityCard({ name, image, role, skinTypes, stats }: UserIdentityProps) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-linear-to-br from-purple-50 to-blue-50 px-6 pt-10 pb-8 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-28 h-28 bg-white rounded-full overflow-hidden mb-5 shadow-sm border border-gray-200">
                <Image src={image} alt={name} width={112} height={112} className="object-cover w-full h-full" />
            </div>
            {/* Name & Role */}
            <h2 className="text-xl font-semibold tracking-tight mb-1">{name}</h2>
            <p className="text-sm font-medium text-purple-600 mb-4 flex items-center gap-1">
                {role} <span role="img" aria-label="lipstick">💄</span>
            </p>
            {/* Skin Tags */}
            <div className="flex gap-2 mb-8">
                {skinTypes.map((t) => (
                    <span key={t.label} className={`text-xs px-3 py-1 rounded-full border font-medium flex items-center gap-1 ${t.active ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200 text-gray-500"}`}>
                        <span className={`w-3 h-3 rounded-sm border flex items-center justify-center text-[8px] ${t.active ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300"}`}></span>
                        {t.label}
                    </span>
                ))}
            </div>
            {/* Stats */}
            <div className="flex-between w-full">
                <StatBlock value={stats.products} label="Products" />
                <Divider />
                <StatBlock value={stats.reviews} label="Reviews" />
                <Divider />
                <StatBlock value={stats.challenge} label="Challenge" />
            </div>
        </div>
    );
}

function StatBlock({ value, label }: { value: number; label: string }) {
    return (
        <div className="px-5">
            <p className="text-lg font-semibold leading-none mb-1">{value}</p>
            <p className="text-[11px] text-gray-600 tracking-tight">{label}</p>
        </div>
    );
}

function Divider() {
    return <div className="w-px bg-gray-300" />;
}
