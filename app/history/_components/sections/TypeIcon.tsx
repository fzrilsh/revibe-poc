import { FaTrashAlt, FaBox, FaRegFolderOpen, FaEdit } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";

type HistoryType = "added" | "expired" | "removed" | "edited";

interface TypeIconProps {
    type: HistoryType;
}

export default function TypeIcon({ type }: TypeIconProps) {
    const base = "w-10 h-10 rounded-full flex items-center justify-center text-lg";

    switch (type) {
        case "added":
            return (
                <div className={`${base} bg-purple-100`}>
                    <FaRegFolderOpen />
                </div>
            );
        case "edited":
            return (
                <div className={`${base} bg-blue-100`}>
                    <FaEdit />
                </div>
            );
        case "expired":
            return (
                <div className={`${base} bg-purple-100`}>
                    <LuAlarmClock />
                </div>
            );
        case "removed":
            return (
                <div className={`${base} bg-purple-100`}>
                    <FaTrashAlt />
                </div>
            );
        default:
            return (
                <div className={`${base} bg-purple-100`}>
                    <FaBox />
                </div>
            );
    }
}
