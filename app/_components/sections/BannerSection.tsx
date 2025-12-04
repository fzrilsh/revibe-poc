import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";

export function BannerSection() {
    return (
        <div className="relative w-full rounded-xl overflow-hidden">
            <Image src={"/home/banner_home.svg"} alt="Banner Home" width={800} height={200} className="object-cover w-full h-full" />
            <div className="absolute top-0 left-0 h-full flex-start justify-center flex-col p-4">
                <p className="font-light">Welcome to</p>
                <h2 className="font-bold mb-1 text-xl">REVIBE</h2>
                <button className="font-medium flex items-center text-sm gap-1 bg-white px-2 py-1 rounded-full border-2 border-gray-300">
                    Getting Started <FaChevronRight />
                </button>
            </div>
        </div>
    );
}
