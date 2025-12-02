interface CategoryChipsProps {
    categories: string[];
    active: string[];
    onToggle: (category: string) => void;
}

export default function CategoryChips({ categories, active, onToggle }: CategoryChipsProps) {
    return (
        <div className="flex gap-3 scrollbar-hide flex-nowrap">
            {categories.map((cat) => {
                const isActive = active.includes(cat);
                return (
                    <button key={cat} onClick={() => onToggle(cat)} className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium border transition ${isActive ? "border-transparent bg-blue-chalk text-black" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"}`}>
                        {isActive && <span className="w-3 h-3 rounded-sm bg-perfume" />}
                        <span>{cat}</span>
                    </button>
                );
            })}
        </div>
    );
}
