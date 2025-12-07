import Image from "next/image";

interface SkinType {
    label: string;
    active: boolean;
}
interface Stats {
    products: number;
    reviews: number;
    challenge: number;
}
interface UserIdentityProps {
    name: string;
    image: string;
    role: string;
    skinTypes: SkinType[];
    stats: Stats;
}

export default function IdentityCard({ name, image, role, skinTypes, stats }: UserIdentityProps) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-linear-to-br from-purple-50 to-blue-50 px-6 pt-10 pb-8 flex flex-col w-full items-center text-center">
            {/* Avatar */}
            <div className="w-28 h-28 bg-white rounded-full overflow-hidden mb-5 shadow-sm border border-gray-200">
                <Image src={image} alt={name} width={112} height={112} className="object-cover w-full h-full" />
            </div>
            {/* Name & Role */}
            <h2 className="text-2xl font-semibold tracking-tight mb-1">{name}</h2>
            <p className="text-sm font-medium text-black bg-[#DAFFE1] py-2 px-4 rounded-full border border-gray-300 mb-4 flex items-center gap-1">
                <span role="img" aria-label="lipstick">
                    🌱
                </span>{" "}
                {role}
            </p>
            {/* Skin Tags */}
            <div className="flex gap-2 mb-8">
                {skinTypes.map((t) => (
                    <span key={t.label} className={`text-xs px-3 py-1 rounded-full border border-chetwode-blue font-medium flex items-center gap-1 bg-white`}>
                        {/* <span className={`w-3 h-3 rounded-sm border flex items-center justify-center text-[8px] ${t.active ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300"}`}></span> */}
                        {t.label}
                    </span>
                ))}
            </div>
            {/* Stats */}
            <div className="flex-between w-full h-full items-stretch">
                <StatBlock value={stats.products} label="Products" />
                <Divider />
                <StatBlock onClick={() => window.location.href = "/profile/reviews"} value={stats.reviews} label="Reviews" />
                <Divider />
                <StatBlock onClick={() => window.location.href = "/profile/challenge"} value={stats.challenge} label="Challenge" />
            </div>
        </div>
    );
}

function StatBlock({ value, label, onClick }: { value: number; label: string; onClick?: () => void }) {
    return (
        <div className="px-5" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <p className="text-lg font-semibold leading-none mb-1">{value}</p>
            <p className="text-[11px] text-gray-600 tracking-tight">{label}</p>
        </div>
    );
}

function Divider() {
    return <div className="bg-black min-h-full w-0.5 rounded-full" />;
}
