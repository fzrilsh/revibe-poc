import { ChangeEvent } from "react";
import { FiChevronDown } from "react-icons/fi";

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

interface ProductFieldsProps {
    data: ProductFormData;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const categories = ["Skincare", "Makeup", "Bodycare", "Haircare", "Fragrances", "Other"];
const inUseOptions = ["Yes", "No"];
const periodOptions = ["6 months", "12 months", "24 months", "36 months"];
const ratings = ["1", "2", "3", "4", "5"];

export default function ProductFields({ data, onChange }: ProductFieldsProps) {
    return (
        <div className="flex flex-col gap-5">
            <FieldText label="Brand" name="brand" value={data.brand} onChange={onChange} required placeholder="Type brand name..." />
            <FieldText label="Product Name" name="name" value={data.name} onChange={onChange} required placeholder="Type product name..." />
            <div className="grid grid-cols-2 gap-4">
                <FieldSelect label="Category" name="category" value={data.category} onChange={onChange} required options={categories} />
                <FieldText label="Price" name="price" value={data.price} onChange={onChange} required placeholder="Enter product price..." type="number" />
            </div>
            <FieldDate label="Expiration date" name="expirationDate" value={data.expirationDate} onChange={onChange} required />
            <div className="grid grid-cols-2 gap-4">
                <FieldDate label="Opening date" name="openingDate" value={data.openingDate} onChange={onChange} required />
                <FieldSelect label="Period after opening" name="periodAfterOpening" value={data.periodAfterOpening} onChange={onChange} required options={periodOptions} />
            </div>
            <FieldSelect label="Currently in use?" name="currentlyInUse" value={data.currentlyInUse} onChange={onChange} required options={inUseOptions} />
            <FieldText label="Product usage" name="usage" value={data.usage} onChange={onChange} required placeholder="e.g. 50%" type="number" />
            <FieldText label="Select Color Variation" name="colorVariant" value={data.colorVariant} onChange={onChange} placeholder="e.g. Light Beige" />
            <FieldSelect label="Select rating" name="rating" value={data.rating} onChange={onChange} options={ratings} />
            
            {/* Status field - read-only for now, can be moved to History later */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium">Status</label>
                <input 
                    type="text" 
                    name="status" 
                    value={data.status} 
                    readOnly 
                    className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 cursor-not-allowed" 
                />
                <p className="text-xs text-gray-500 mt-2">Product will be stored in Cabinet. You can move it to History later.</p>
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

interface FieldSelectProps extends FieldBaseProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}

function FieldSelect({ label, name, value, onChange, options, required }: FieldSelectProps) {
    return (
        <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-medium">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <select name={name} value={value} onChange={onChange} className="appearance-none w-full rounded-full border border-gray-300 bg-white px-4 py-3 pr-10 text-sm focus:outline-none focus:border-gray-400">
                    {!required && <option value="">Select...</option>}
                    {required && value === "" && (
                        <option value="" disabled>
                            Select a category...
                        </option>
                    )}
                    {options.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />
            </div>
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
