interface BlogHeaderProps {
    author: string;
    title: string;
}

export default function BlogHeader({ author, title }: BlogHeaderProps) {
    return (
        <div className="mb-4">
            <p className="text-sm text-purple-600 font-medium mb-2">{author}</p>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
        </div>
    );
}
