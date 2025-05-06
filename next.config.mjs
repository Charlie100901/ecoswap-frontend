/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'ecoswap-backend.onrender.com',
            pathname: '/images/**', 
          },
        ],
      },
    

};

export default nextConfig;
