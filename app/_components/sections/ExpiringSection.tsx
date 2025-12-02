import Image from "next/image";

const expiringProducts = [
    {
        id: "prod-1",
        name: "Skintific Ceramide Moisturizer",
        img: "/products/skintific.svg",
        daysLeft: 10,
    },
];

export function ExpiringSection() {
    return (
        <div className="bg-gray-200 p-4 rounded-2xl w-full flex-center flex-col gap-4">
            <div className="flex-between w-full">
                <h1 className="font-semibold flex items-center gap-2">
                    <span className="text-xl">⛔️</span> Expiring Soon
                </h1>
                <button className="text-gray-500 text-sm hover:text-gray-700">View All</button>
            </div>

            <div className="flex-col w-full gap-3 flex-center">
                {expiringProducts.map((prod) => (
                    <div key={prod.id} className="bg-white w-full rounded-xl p-3 flex-center flex-row gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            <Image src={prod.img} alt={prod.name} width={64} height={64} className="object-cover w-full h-full" />
                        </div>
                        <h3 className="flex-1 text-woodsmoke">{prod.name}</h3>
                        <span className="bg-[#F52664] text-white text-sm font-semibold px-4 py-2 rounded-full">{prod.daysLeft}d</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
