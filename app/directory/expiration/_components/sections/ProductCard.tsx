import Image from "next/image";
import { FaCalendar } from "react-icons/fa6";
import { ExpiringProduct } from "../ExpirationContent";

interface ProductCardProps {
    product: ExpiringProduct;
    onMoveToHistory: (id: string) => void;
    onSetReminder: (id: string) => void;
}

export default function ProductCard({ product, onMoveToHistory, onSetReminder }: ProductCardProps) {
    return (
        <div className="relative bg-white rounded-xl border border-gray-100 p-3">
            <div className="flex gap-3">
                {/* Product Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold capitalize leading-tight mb-1">{product.brand}</p>
                    <p className="text-sm text-gray-700 leading-tight mb-1">{product.name}</p>
                    <p className="text-xs text-gray-400 leading-tight">{product.expiredDate}</p>

                    {/* Action Buttons */}
                </div>

                {/* Days Left Badge */}
                <div className="absolute flex items-center gap-0.5 top-2 right-2 bg-remy text-cerise-red text-[10px] font-bold px-2 py-1 rounded-full ">
                    <FaCalendar /> <span>{product.daysLeft}d</span>
                </div>
            </div>

            <div className="flex gap-2 mt-3">
                <button onClick={() => onMoveToHistory(product.id)} className="cursor-pointer bg-cerise-red text-white text-sm px-3 py-1.5 rounded-sm active:scale-95 transition">
                    Move to history
                </button>
                <button onClick={() => onSetReminder(product.id)} className="cursor-pointer bg-black text-white text-sm px-3 py-1.5 rounded-sm active:scale-95 transition">
                    Set reminder
                </button>
            </div>
        </div>
    );
}
