import type { UserPublic } from "@/features/auth/auth.types";

type Props = {
    user?: UserPublic | null;
    loading?: boolean;
};

export function GreetingSection({ user, loading }: Props) {
    const name = user?.nickname || "Cantika";
    return (
        <div className="w-full flex-start flex-col gap-2">
            <h1 className="text-2xl font-semibold">
                {loading ? "Halo…" : `Halo ${name} 👋`}
            </h1>
            <p className="text-">Ready to glow today?</p>
        </div>
    );
}
