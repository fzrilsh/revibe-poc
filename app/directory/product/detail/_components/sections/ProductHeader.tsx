interface ProductHeaderProps {
    name: string;
    brand: string;
}

export default function ProductHeader({ name, brand }: ProductHeaderProps) {
    return (
        <div className="mb-6 w-full text-left">
            <p className="text-lg text-black font-medium">{brand}</p>
            <h2 className="text-xl font-bold mb-1 text-woodsmoke">{name}</h2>
        </div>
    );
}
