import Link from 'next/link'

export function TopNav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/messages"
              className="text-gray-700 hover:text-gray-900"
            >
              Messages
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
