import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // Je website ba domain theke image ante chan tar hostname
      },
    ],
  },
}

export default nextConfig
