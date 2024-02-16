/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { //i.scdn.co
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      }
    ],
  },
};

export default nextConfig;