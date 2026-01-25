/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "i.scdn.co",
      },
      {
        hostname: "image-cdn-fa.spotifycdn.com",
      },
      {
        hostname: "image-cdn-ak.spotifycdn.com",
      },
      {
        hostname: "encrypted-tbn0.gstatic.com",
      },
    ],
  },
};

export default nextConfig;
