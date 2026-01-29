import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Fix for Vercel detecting parent lockfile
  outputFileTracingRoot: path.join(__dirname, './'),
}

export default nextConfig
