import { createAuthClient } from 'better-auth/react'
import { magicLinkClient } from 'better-auth/client/plugins'

// Get base URL from environment variable or detect from browser
const getBaseURL = () => {
  // In browser, use the current origin (works for same-domain deployments)
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // For SSR, require environment variable
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error(
      'NEXT_PUBLIC_BASE_URL environment variable is required for server-side rendering'
    )
  }
  return process.env.NEXT_PUBLIC_BASE_URL
}

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: getBaseURL(),
  plugins: [magicLinkClient()],
})
