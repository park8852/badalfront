/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 네트워크 접근을 위한 설정
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
