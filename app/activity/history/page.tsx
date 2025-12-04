import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import { ActivityTabs } from "@features/ActivityTabs";
import HistoryContent from "./_components/HistoryContent";

export default function HistoryPage() {
    return (
        <>
            <Header />
            <ActivityTabs />
            <main className="pt-40 pb-24 min-h-screen h-full">
                <HistoryContent />
            </main>
            <Navbar />
        </>
    );
}
