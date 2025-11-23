import Image from "next/image";

export function SplashLogo() {
    return <Image src={"/logo-revibe.svg"} height={70} width={240} alt="Revibe Logo" priority />;
}
