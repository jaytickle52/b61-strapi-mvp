import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

const withPayloadConfig = withPayload(nextConfig, { devBundleServerPackages: false })

// Payload adds colour-scheme hint headers (Accept-CH / Critical-CH /
// Vary: Sec-CH-Prefers-Color-Scheme) to every address so its admin can pick
// light or dark. On public pages Critical-CH makes Chrome request the page a
// second time on a first visit (Lighthouse counted 340-940 ms). Keep them for
// the admin only.
const payloadHeaders = withPayloadConfig.headers
withPayloadConfig.headers = async () => {
  const rules = payloadHeaders ? await payloadHeaders() : []
  return rules.map((rule) =>
    rule.source === '/:path*' && rule.headers.some((h) => h.key === 'Critical-CH') ? { ...rule, source: '/admin/:path*' } : rule,
  )
}

export default withPayloadConfig
