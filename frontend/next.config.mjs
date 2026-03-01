/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "yt3.googleusercontent.com",
      },
      {
        hostname: "i.ytimg.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "lastfm.freetls.fastly.net",
      },
    ],
  },
};

export default nextConfig;
