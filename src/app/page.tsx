import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold py-4">next-16-prisma-better-auth</h1>
        <p className="mt-8">You are not logged in</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold py-4">next-16-prisma-better-auth</h1>
      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="h-20 w-20 rounded-full"
          />
        )}
        <div>
          <p className="text-xl font-semibold">{session.user.name}</p>
          <p className="text-gray-400">{session.user.email}</p>
          <p className="text-sm text-gray-400">ID: {session.user.id}</p>
        </div>
      </div>
    </div>
  )
}
