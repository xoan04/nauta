/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3hack.kodelabs.dev",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "s3hack.kodelabs.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
