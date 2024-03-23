/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.discordapp.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
        remotePatterns:[
            {
                hostname: "avatars.githubusercontent.com",
                protocol: "https",
            },
        ],
    },
};

export default nextConfig;
