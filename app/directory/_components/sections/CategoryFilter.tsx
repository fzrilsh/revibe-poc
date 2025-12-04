import { FiChevronDown } from "react-icons/fi";

const categories = ["All", "Skincare", "Makeup", "Bodycare", "Haircare", "Fragrances", "Other"];

interface CategoryFilterProps {
    category: string;
    onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ category, onCategoryChange }: CategoryFilterProps) {
    return (
        <div className="w-full">
            <div className="relative w-full">
                <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className="appearance-none w-full border border-gray-300 rounded-xl py-3 px-4 pr-10 text-sm bg-white focus:outline-none focus:border-gray-400">
                    <option value="" disabled>
                        Select category
                    </option>
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />
            </div>
        </div>
    );
}
