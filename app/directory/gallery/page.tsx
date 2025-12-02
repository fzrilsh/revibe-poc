import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import GalleryContent from "./_components/GalleryContent";
import { DirectoryTabs } from "@features/DirectoryTabs";

export default function GalleryPage() {
    return (
        <>
            <Header />
            <DirectoryTabs />
            <main className="pt-40 pb-24 min-h-screen h-full">
                <GalleryContent />
            </main>
            <Navbar />
        </>
    );
}
