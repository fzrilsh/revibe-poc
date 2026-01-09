interface BlogBodyProps {
    content: string; // Full HTML content including images and tips
}

export default function BlogBody({ content }: BlogBodyProps) {
    const isHtml = typeof content === "string" && /<\s*\w+[^>]*>/i.test(content.trim());

    return <div className=" mb-4">{isHtml ? <div className="text-sm text-gray-700 leading-relaxed space-y-3 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} /> : <p className="text-sm text-gray-700 leading-relaxed mb-4">{content}</p>}</div>;
}
