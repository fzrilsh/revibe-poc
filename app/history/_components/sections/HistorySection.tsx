import HistoryRow from "./HistoryRow";
import { HistoryItem } from "../HistoryContent";

interface HistorySectionProps {
    title: string;
    items: HistoryItem[];
    className?: string;
}

export default function HistorySection({ title, items, className = "" }: HistorySectionProps) {
    return (
        <section className={`${className} px-6 bg-white py-4`}>
            <h3 className="text-sm font-semibold mb-2">{title}</h3>
            <div className="overflow-hidden">
                {items.map((item, idx) => (
                    <HistoryRow key={item.id} item={item} showDivider={idx < items.length - 1} />
                ))}
            </div>
        </section>
    );
}
