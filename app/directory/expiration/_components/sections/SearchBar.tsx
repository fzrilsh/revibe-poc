import { ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
    search: string;
    onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ search, onSearch }: SearchBarProps) {
    return (
        <div className="relative mb-6">
            <input type="text" value={search} onChange={onSearch} placeholder="Search by keyword" className="w-full rounded-full border border-gray-300 bg-white pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-gray-400" />
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
    );
}
