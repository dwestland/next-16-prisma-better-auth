import { signUpAction } from '../actions/auth'

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form action={signUpAction} className="flex flex-col gap-3 w-64">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}
