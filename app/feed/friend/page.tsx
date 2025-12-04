import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import CommunityTabs from "@features/CommunityTabs";
import FriendContent from "./_components/FriendContent";

export default function FriendPage() {
    return (
        <>
            <Header />
            <CommunityTabs />
            <main className="pt-32 pb-24 min-h-screen h-full">
                <FriendContent />
            </main>
            <Navbar />
        </>
    );
}
