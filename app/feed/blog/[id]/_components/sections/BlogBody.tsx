import Image from "next/image";

interface BlogBodyProps {
    content: string;
    images?: string[];
    tips?: {
        icon: string;
        text: string;
    }[];
    title: string;
}

export default function BlogBody({ content, images, tips, title }: BlogBodyProps) {
    return (
        <div className="p-4 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{content}</p>

            {/* Additional Images */}
            {images && images.length > 0 && (
                <div className="space-y-4 mb-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative w-full aspect-video rounded-xl overflow-hidden">
                            <Image src={img} alt={`${title} image ${idx + 1}`} fill className="object-cover" />
                        </div>
                    ))}
                </div>
            )}

            {/* Tips Section */}
            {tips && tips.length > 0 && (
                <div className="">
                    <h3 className="font-bold text-sm mb-3">Tips from REVIBE team:</h3>
                    <div className="space-y-2">
                        {tips.map((tip, idx) => (
                            <div key={idx} className="flex gap-2">
                                <span className="text-sm shrink-0">{tip.icon}</span>
                                <p className="text-sm text-gray-700">{tip.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
