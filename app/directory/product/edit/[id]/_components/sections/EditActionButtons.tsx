interface EditActionButtonsProps {
    isEnabled: boolean;
    isSubmitting: boolean;
}

export default function EditActionButtons({ isEnabled, isSubmitting }: EditActionButtonsProps) {
    return (
        <button
            type="submit"
            disabled={!isEnabled || isSubmitting}
            className={`mt-2 w-full rounded-full py-3 text-sm font-medium transition ${isEnabled && !isSubmitting ? "bg-black text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
        >
            {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
    );
}
