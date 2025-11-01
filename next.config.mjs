/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'ecoswap-backend.onrender.com',
            pathname: '/images/**', 
          },
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '8080',
            pathname: '/images/**',
          },
        ],
      },
    

};

export default nextConfig;
