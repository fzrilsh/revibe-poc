import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import { ActivityTabs } from "@features/ActivityTabs";
import GoalsContent from "./_components/GoalsContent";

export default function GoalsPage() {
    return (
        <>
            <Header />
            <ActivityTabs />
            <main className="pt-32 pb-24 min-h-screen h-full bg-onboarding">
                <GoalsContent />
            </main>
            <Navbar />
        </>
    );
}
