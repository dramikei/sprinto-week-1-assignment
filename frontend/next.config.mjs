/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
          protocol: 'http',
          hostname: 's3.dramikei.com',
          port: '',
          pathname: '/sprinto-week-1-assignment/uploads/**'
        },
        {
          protocol: 'https',
          hostname: 's3.dramikei.com',
          port: '',
          pathname: '/sprinto-week-1-assignment/uploads/**'
        }
      ]
      }
};

export default nextConfig;
