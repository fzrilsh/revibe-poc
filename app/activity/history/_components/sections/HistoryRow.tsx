import { IoCalendarOutline } from "react-icons/io5";
import TypeIcon from "./TypeIcon";
import { HistoryItem } from "../HistoryContent";

function formatRelative(dt: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - dt.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 6) return `${diffH}h ago`;
    return dt.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

interface HistoryRowProps {
    item: HistoryItem;
    showDivider: boolean;
}

export default function HistoryRow({ item, showDivider }: HistoryRowProps) {
    return (
        <div className={`flex items-start gap-3 py-2 text-sm ${showDivider ? "border-b border-blue-chalk" : ""}`}>
            <TypeIcon type={item.type} />
            <div className="flex-1">
                <p className="font-semibold leading-tight">{item.title}</p>
                <p className="text-sm text-gray-600 mt-1 leading-snug">{item.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="text-sm text-cerise-red font-medium">{formatRelative(item.createdAt)}</span>
                <span className="text-gray-500 text-lg leading-none">
                    <IoCalendarOutline />
                </span>
            </div>
        </div>
    );
}
