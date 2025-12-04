import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ["http://192.168.1.3:3000"],
    images: {
        domains: ["ezxbmgxyklsdxedqlqpc.supabase.co"],
        remotePatterns: [   
            {
                protocol: 'https',
                hostname: 'ezxbmgxyklsdxedqlqpc.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
        unoptimized: false,
    },
};

export default nextConfig;
