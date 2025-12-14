import { signInAction } from '../actions/auth'
import { GitHubSignInButton } from './GitHubSignInButton'
import { GoogleSignInButton } from './GoogleSignInButton'
import { MagicLinkSignIn } from './MagicLinkSignIn'

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
        <span className="text-sm text-left py-0">
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Sign up here
          </a>
        </span>
      </form>
      <div className="flex w-64 items-center gap-3">
        <div className="h-px flex-1 bg-gray-400" />
        <span className="text-sm">or</span>
        <div className="h-px flex-1 bg-gray-400" />
      </div>
      <div className="flex w-64 flex-col gap-2">
        <GoogleSignInButton />
        <GitHubSignInButton />
      </div>
      <div className="flex w-64 items-center gap-3">
        <div className="h-px flex-1 bg-gray-400" />
        <span className="text-sm">or use your email</span>
        <div className="h-px flex-1 bg-gray-400" />
      </div>
      <MagicLinkSignIn />
    </div>
  )
}
