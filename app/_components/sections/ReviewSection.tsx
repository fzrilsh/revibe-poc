import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { FaRegCommentAlt } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";

const reviews = [
    {
        id: "rev-1",
        user: { name: "Tania Putri", avatar: "/home/profile.svg", skinType: "Sensitive Skin" },
        date: "2 Nov 2025",
        product: { name: "Skintific Ceramide Moisturizer", img: "/products/skintific.svg" },
        rating: 5,
        review: "Aku suka banget moist ini, definitely will repurchase!",
        repurchase: true,
        usagePeriod: "1 week",
        likes: 50,
        comments: 6,
    },
];

export function ReviewSection() {
    return (
        <div className="flex-start gap-3 flex-col w-full">
            <h2 className="font-semibold text-lg">Review from community</h2>
            <div className="space-y-4 w-full">
                {reviews.map((rev) => (
                    <div key={rev.id} className="bg-white rounded-2xl p-4 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                    <Image src={rev.user.avatar} alt={rev.user.name} width={48} height={48} className="object-cover w-full h-full" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-woodsmoke">{rev.user.name}</h3>
                                    <p className="text-xs text-gray-500">
                                        {rev.date} | {rev.user.skinType}
                                    </p>
                                </div>
                            </div>
                            <span className="bg-[#FFD93D] text-black text-xs font-semibold px-3 py-1 rounded-full">Review</span>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                                <h4 className="font-semibold text-woodsmoke">{rev.product.name}</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">{rev.review}</p>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: rev.rating }).map((_, i) => (
                                        <IoMdStar key={i} className="text-[#FFD93D] text-lg" />
                                    ))}
                                </div>
                                <div className="flex flex-col gap-2 text-xs text-gray-600">
                                    <span>
                                        Repurchase: <strong>{rev.repurchase ? "Yes" : "No"}</strong>
                                    </span>
                                    <span>
                                        Usage period: <strong>{rev.usagePeriod}</strong>
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 pt-2">
                                    <button className="flex items-center gap-1 hover:text-red-500">
                                        <CiHeart /> {rev.likes}
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-blue-500">
                                        <FaRegCommentAlt /> {rev.comments}
                                    </button>
                                </div>
                            </div>
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                <Image src={rev.product.img} alt={rev.product.name} width={80} height={80} className="object-cover w-full h-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
