interface ProductHeaderProps {
    name: string;
    brand: string;
}

export default function ProductHeader({ name, brand }: ProductHeaderProps) {
    return (
        <div className="mb-6 w-full text-center">
            <h2 className="text-xl font-bold mb-1">{name}</h2>
            <p className="text-lg text-blue-600 font-medium">{brand}</p>
        </div>
    );
}
