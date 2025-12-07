import Image from "next/image";

interface StatsSectionProps {
    itemsCount: number;
    expireCount: number;
    challengeCount: number;
}

export function StatsSection({ itemsCount, expireCount, challengeCount }: StatsSectionProps) {
    const stats = [
        { id: "products", value: itemsCount, label: "Products", icon: "/icons/product.svg", click: "/directory" },
        { id: "expiring", value: expireCount, label: "Expiring", icon: "/icons/expiring.svg", click: "/directory?filter=expiring" },
        { id: "challenge", value: challengeCount, label: "Challenge", icon: "/icons/challenge.svg", click: "/activity/challenge" },
    ];

    return (
        <div className="grid xs:grid-cols-2 grid-cols-3 gap-4 w-full">
            {stats.map((item) => (
                <div onClick={() => window.location.href = item.click} key={item.id} className="cursor-pointer bg-white p-4 rounded-xl w-full flex-start flex-col">
                    <Image src={item.icon} alt={item.label} width={40} height={40} className="object-contain ml-auto" />
                    <div className="flex-start flex-col">
                        <h2 className="text-2xl">{item.value ?? 0}</h2>
                        <p className="font-light">{item.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
