interface FilterPanelProps {
  sortBy: string;
  onChangeSort: (value: string) => void;
}

export default function FilterPanel({ sortBy, onChangeSort }: FilterPanelProps) {
  return (
    <div className="text-sm text-gray-700 leading-relaxed">
      <p className="font-semibold mb-1">Sorted by</p>
      <ul className="space-y-2">
        <li>
          <button
            type="button"
            onClick={() => onChangeSort("latest")}
            className={sortBy === "latest" ? "font-medium text-black" : "text-gray-500"}
          >
            Latest purchase
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => onChangeSort("incoming")}
            className={sortBy === "incoming" ? "font-medium text-black" : "text-gray-500"}
          >
            Incoming expiration date
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => onChangeSort("alpha")}
            className={sortBy === "alpha" ? "font-medium text-black" : "text-gray-500"}
          >
            Alphabetical
          </button>
        </li>
      </ul>
    </div>
  );
}
