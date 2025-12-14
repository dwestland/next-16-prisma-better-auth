'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export function MagicLinkSignUp() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authClient.signIn.magicLink({
        email,
        callbackURL: '/',
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="w-64 rounded border border-green-200 bg-green-50 p-4 text-center text-sm text-green-700">
        Check your email for the magic link!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-64 flex-col gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email for magic link"
        required
        className="rounded border px-3 py-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </form>
  )
}
