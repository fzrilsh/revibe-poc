export default function StatsSection() {
    return (
        <div className="w-full pt-8">
            <div className="p-4 w-full">
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="flex items-center gap-2 bg-white rounded-2xl p-4">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-xs text-gray-500">Friends</p>
                            <p className="text-xl font-bold">10</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-2xl p-4">
                        <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        <div>
                            <p className="text-xs text-gray-500">Request</p>
                            <p className="text-xl font-bold">1</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
