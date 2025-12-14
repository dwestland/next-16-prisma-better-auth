import { signInAction } from '../actions/auth'
import { GitHubSignInButton } from './GitHubSignInButton'

export default function SignInPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form action={signInAction} className="flex w-64 flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="rounded border px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
      <div className="flex w-64 items-center gap-3">
        <div className="h-px flex-1 bg-gray-300" />
        <span className="text-sm text-gray-500">or</span>
        <div className="h-px flex-1 bg-gray-300" />
      </div>
      <div className="w-64">
        <GitHubSignInButton />
      </div>
    </div>
  )
}
