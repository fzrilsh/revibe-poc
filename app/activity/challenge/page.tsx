import Header from "@navigation/header";
import Navbar from "@navigation/navbar";
import { ActivityTabs } from "@features/ActivityTabs";
import ChallengeListContent from "./_components/ChallengeListContent";

export default function ChallengePage() {
    return (
        <>
            <Header />
            <ActivityTabs />
            <main className="pt-40 pb-24 min-h-screen h-full">
                <ChallengeListContent />
            </main>
            <Navbar />
        </>
    );
}
