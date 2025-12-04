import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import CommunityTabs from "@features/CommunityTabs";
import CommunityContent from "./_components/CommunityContent";

export default function CommunityPage() {
    return (
        <>
            <Header />
            <CommunityTabs />
            <main className="pt-40 pb-24 min-h-screen h-full">
                <CommunityContent />
            </main>
            <Navbar />
        </>
    );
}
