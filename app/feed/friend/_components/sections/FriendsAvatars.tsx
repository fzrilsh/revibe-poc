import Image from "next/image";

interface Friend {
    id: string;
    name: string;
    avatar: string;
}

interface FriendsAvatarsProps {
    friends: Friend[];
}

export default function FriendsAvatars({ friends }: FriendsAvatarsProps) {
    return (
        <div className="p-4">
            <div className="flex gap-4">
                {friends.map((friend) => (
                    <div key={friend.id} className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-purple-200">
                            <Image src={friend.avatar} alt={friend.name} width={64} height={64} className="object-cover w-full h-full" />
                        </div>
                        <p className="text-xs font-medium mt-1">{friend.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
