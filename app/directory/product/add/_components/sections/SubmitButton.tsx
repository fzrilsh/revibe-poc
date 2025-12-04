interface SubmitButtonProps {
    isEnabled: boolean;
}

export default function SubmitButton({ isEnabled }: SubmitButtonProps) {
    return (
        <button type="submit" disabled={!isEnabled} className={`mt-2 w-full rounded-full py-3 text-sm font-medium transition ${isEnabled ? "bg-black text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            Submit
        </button>
    );
}
