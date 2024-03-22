/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.discordapp.com', 'avatars.githubusercontent.com'],
        remotePatterns:[
            {
                hostname: "avatars.githubusercontent.com",
                protocol: "https",
            },
        ],
    },
};

export default nextConfig;
