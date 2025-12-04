import Image from "next/image";

const categories = [
    { id: "skincare", label: "Skincare", img: "/home/category/skincare.svg" },
    { id: "makeup", label: "Makeup", img: "/home/category/makeup.svg" },
    { id: "bodycare", label: "Bodycare", img: "/home/category/bodycare.svg" },
    { id: "haircare", label: "Haircare", img: "/home/category/haircare.svg" },
    { id: "fragrances", label: "Fragrances", img: "/home/category/fragrances.svg" },
    { id: "other", label: "Other", img: "/home/category/other.svg" },
];

export function CategorySection() {
    return (
        <div className="flex-start gap-3 flex-col w-full overflow-hidden">
            <h2 className="font-semibold">Jump into category</h2>
            <div className="flex gap-4 w-full overflow-x-auto scrollbar-none scrollbar-hide">
                {categories.map((cat) => (
                    <button key={cat.id} type="button" className="flex flex-col items-center gap-2 min-w-[90px]">
                        <span className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                            <Image src={cat.img} alt={cat.label} width={64} height={64} className="object-contain" />
                        </span>
                        <span className="text-sm text-woodsmoke">{cat.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
