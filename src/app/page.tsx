import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { signOutAction } from './actions/auth'

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-4xl font-bold">next-15-prisma-better-auth</h1>
        <div className="flex gap-4 mt-8">
          <p>Home page text goes here</p>
          <button>
            <Link href="/signup">Sign Up</Link>
          </button>
          <button>
            <Link href="/signin">Sign In</Link>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">next-15-prisma-better-auth</h1>
      <div className="mt-8 text-center">
        <p className="text-lg mb-4">User ID: {session.user.id}</p>
        <form action={signOutAction}>
          <button>Logout</button>
        </form>
      </div>
    </div>
  )
}
