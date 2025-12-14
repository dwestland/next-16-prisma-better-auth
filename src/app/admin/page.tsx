import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/signin')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold">Admin</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome, {session.user.name || session.user.email}! This page is only
          accessible to administrators.
        </p>
      </div>
    </main>
  )
}
