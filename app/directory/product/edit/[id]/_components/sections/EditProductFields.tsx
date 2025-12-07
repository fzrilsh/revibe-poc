import BottomSheetSelectColor from "@ui/BottomSheetSelectColor";
import BottomSheetSelect from "@ui/BottomSheetSelect";
import { ChangeEvent } from "react";

interface ProductFormData {
    brand: string;
    name: string;
    category: string;
    price: string;
    expirationDate: string;
    openingDate: string;
    periodAfterOpening: string;
    currentlyInUse: string;
    usage: string;
    colorVariant: string;
    rating: string;
    status: string;
}

interface EditProductFieldsProps {
    data: ProductFormData;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const categories = ["Skincare", "Makeup", "Bodycare", "Haircare", "Fragrances", "Other"];
const inUseOptions = ["Yes", "No"];
const periodOptions = ["6 months", "12 months", "24 months", "36 months"];
const productUsages = ["0% — Brand new", "25% — Lightly used", "50% — Half used", "75% — Mostly used", "100% — Empty"];

const colorOptions = [
    { id: "warm-nude", label: "Warm Nude", color: "#E4A38A" },
    { id: "baby-pink", label: "Baby Pink", color: "#F7C3C8" },
    { id: "rosy-pink", label: "Rosy Pink", color: "#D68086" },
    { id: "mauve", label: "Mauve", color: "#B07A8C" },
    { id: "hot-pink", label: "Hot Pink", color: "#E84571" },
    { id: "classic-red", label: "Classic Red", color: "#C2352A" },
    { id: "orange-coral", label: "Orange Coral", color: "#F28A5B" },
    { id: "terracotta", label: "Terracotta", color: "#C56548" },
    { id: "cocoa-brown", label: "Cocoa Brown", color: "#8A4B37" },
];

export default function EditProductFields({ data, onChange }: EditProductFieldsProps) {
    return (
        <div className="flex flex-col gap-5">
            <FieldText label="Brand" name="brand" value={data.brand} onChange={onChange} required placeholder="Type brand name..." />
            <FieldText label="Product Name" name="name" value={data.name} onChange={onChange} required placeholder="Type product name..." />
            <div className="grid grid-cols-2 gap-4">
                <BottomSheetSelect className="bottom-18" label="Category" name="category" value={data.category} onChange={onChange} required options={categories} />
                <FieldText label="Price" name="price" value={data.price} onChange={onChange} required placeholder="Enter product price..." type="number" />
            </div>
            <FieldDate label="Expiration date" name="expirationDate" value={data.expirationDate} onChange={onChange} required />
            <div className="grid grid-cols-2 gap-4">
                <FieldDate label="Opening date" name="openingDate" value={data.openingDate} onChange={onChange} required />
                <BottomSheetSelect className="bottom-18" label="Period after opening" name="periodAfterOpening" value={data.periodAfterOpening} onChange={onChange} required options={periodOptions} />
            </div>
            <BottomSheetSelect className="bottom-18" label="Currently in use?" name="currentlyInUse" value={data.currentlyInUse} onChange={onChange} required options={inUseOptions} />
            <BottomSheetSelect className="bottom-18" label="Product usage" name="usage" value={data.usage} onChange={onChange} required options={productUsages} />
            <BottomSheetSelectColor className="bottom-18" label="Select Color Variation" name="colorVariant" value={data.colorVariant} onChange={onChange} options={colorOptions} />

            <div className="flex-col gap-1 hidden">
                <input type="text" name="status" value={data.status} readOnly className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 cursor-not-allowed" />
            </div>
        </div>
    );
}

interface FieldBaseProps {
    label: string;
    name: string;
    required?: boolean;
}

interface FieldTextProps extends FieldBaseProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
}

function FieldText({ label, name, value, onChange, placeholder, required, type = "text" }: FieldTextProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
        </div>
    );
}

interface FieldDateProps extends FieldBaseProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function FieldDate({ label, name, value, onChange, required }: FieldDateProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <input type="date" name={name} value={value} onChange={onChange} className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
        </div>
    );
}
