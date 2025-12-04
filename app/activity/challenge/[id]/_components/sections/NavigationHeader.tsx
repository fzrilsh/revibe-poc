import { LuArrowLeft } from "react-icons/lu";

export default function NavigationHeader() {
    return (
        <div className="flex items-center gap-3 pt-6 mb-6">
            <button onClick={() => history.back()} className="p-1 rounded hover:bg-gray-100 active:scale-95 transition" aria-label="Back">
                <LuArrowLeft className="text-xl" />
            </button>
            <h1 className="text-lg font-semibold">Challenge</h1>
        </div>
    );
}
