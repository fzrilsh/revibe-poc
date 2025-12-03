import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import CommunityTabs from "@features/CommunityTabs";
import BlogContent from "./_components/BlogContent";

export default function BlogPage() {
    return (
        <>
            <Header />
            <CommunityTabs />
            <main className="pt-40 pb-24 min-h-screen h-full">
                <BlogContent />
            </main>
            <Navbar />
        </>
    );
}
