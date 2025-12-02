import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import ExpirationContent from "./_components/ExpirationContent";
import { DirectoryTabs } from "@features/DirectoryTabs";

export default function ExpirationPage() {
    return (
        <>
            <Header />
            <DirectoryTabs />
            <main className="pt-40 pb-24 min-h-screen h-full">
                <ExpirationContent />
            </main>
            <Navbar />
        </>
    );
}
