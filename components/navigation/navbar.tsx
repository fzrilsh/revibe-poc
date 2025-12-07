"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome, FiHeart, FiUser } from "react-icons/fi";
import { HiOutlineCamera } from "react-icons/hi";
import type { IconType } from "react-icons";

const DirectorySvg = ({ isActive }: { isActive: boolean }) => (
    <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path
            d="M8.25027 20.6001H1.24827L0.604393 8.12527C0.52391 6.83754 1.5702 5.79126 2.77744 5.79126H6.7211C8.00882 5.79126 8.97463 6.83754 8.89414 8.12527L8.25027 20.6001Z"
            stroke={isActive ? "#958FFA" : "#6a7282"}
            strokeWidth="1.2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M7.04301 2.65234H2.45551V5.87166H7.04301V2.65234Z" stroke={isActive ? "#958FFA" : "#6a7282"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.23818 17.2198H3.42128L2.61646 9.49341H6.96255L6.23818 17.2198Z" stroke={isActive ? "#958FFA" : "#6a7282"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.33081 19.2319H16.3791V7.48138C16.3791 6.27414 15.4133 5.30835 14.2061 5.30835H10.7453C9.7795 5.30835 8.89419 5.95221 8.65274 6.91801" stroke={isActive ? "#958FFA" : "#6a7282"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.9303 5.30835H9.85986V0.962271C11.55 0.479373 13.2402 0.479373 14.9303 0.962271V5.30835Z" stroke={isActive ? "#958FFA" : "#6a7282"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.04301 2.65234H2.45551V5.87166H7.04301V2.65234Z" stroke={isActive ? "#958FFA" : "#6a7282"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.23818 17.2198H3.42128L2.61646 9.49341H6.96255L6.23818 17.2198Z" stroke={isActive ? "#958FFA" : "#6a7282"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.33081 19.2319H16.3791V7.48138C16.3791 6.27414 15.4133 5.30835 14.2061 5.30835H10.7453C9.7795 5.30835 8.89419 5.95221 8.65274 6.91801" stroke={isActive ? "#958FFA" : "#6a7282"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.9303 5.30835H9.85986V0.962271C11.55 0.479373 13.2402 0.479373 14.9303 0.962271V5.30835Z" stroke={isActive ? "#958FFA" : "#6a7282"} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface NavItem {
    id: string;
    label: string;
    href: string;
    icon?: IconType;
    customSvg?: boolean;
    groupPrefixes?: string[]; // Additional path prefixes that should activate this item
}

const navItems: NavItem[] = [
    { id: "home", label: "Home", icon: FiHome, href: "/" },
    { id: "directory", label: "Directory", customSvg: true, href: "/directory", groupPrefixes: ["/directory", "/gallery", "/directory/product"] },
    { id: "activity", label: "Activity", icon: HiOutlineCamera, href: "/activity/challenge", groupPrefixes: ["/activity/goals", "/activity/history"] },
    { id: "feed", label: "Feed", icon: FiHeart, href: "/feed/community", groupPrefixes: ["/feed/community", "/feed/friend", "/feed/blog"] },
    { id: "profile", label: "Profile", icon: FiUser, href: "/profile" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="flex items-center justify-around py-2 px-4">
                {navItems.map((item) => {
                    const belongsToGroup = item.groupPrefixes?.some((prefix) => pathname.startsWith(prefix));
                    const isActive = belongsToGroup || pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                        <Link key={item.id} href={item.href} className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition ${isActive ? "bg-blue-chalk text-chetwode-blue" : "text-gray-500 hover:text-gray-700"}`}>
                            {item.customSvg ? <DirectorySvg isActive={isActive} /> : item.icon && <item.icon className="text-2xl" />}
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
