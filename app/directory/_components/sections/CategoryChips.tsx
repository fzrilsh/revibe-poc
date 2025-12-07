import { LuCheck } from "react-icons/lu";

interface CategoryChipsProps {
    categories: string[];
    active: string[];
    onToggle: (category: string) => void;
}

export default function CategoryChips({ categories, active, onToggle }: CategoryChipsProps) {
    return (
        <div className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">
            <div className="inline-flex gap-2">
                {categories.map((cat) => {
                    const isActive = active.includes(cat);
                    return (
                        <button
                            key={cat}
                            onClick={() => onToggle(cat)}
                            className={`shrink-0 flex items-center gap-1 rounded-full px-4 py-2 text-xs font-medium transition border ${isActive ? "border-transparent bg-purple-100 text-purple-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                        >
                            {isActive && <LuCheck />}
                            <span>{cat}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
