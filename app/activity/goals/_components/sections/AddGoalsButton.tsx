export default function AddGoalsButton() {
    return (
        <div className="px-4">
            <button onClick={() => console.log("Add Goals (Coming Soon)")} className="w-full bg-black text-white rounded-full py-4 text-sm font-semibold shadow-md active:scale-[.98] transition">
                Add Goals (Coming Soon)
            </button>
        </div>
    );
}
