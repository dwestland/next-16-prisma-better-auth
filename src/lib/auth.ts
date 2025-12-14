import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { magicLink } from 'better-auth/plugins'
import { db } from './db'
import { nextCookies } from 'better-auth/next-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'USER',
      },
    },
  },
  // TODO: If adding password authentication to production, add change password functionality, add forgot password functionality, and add email verification functionality.
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: process.env.EMAIL_FROM as string,
          to: email,
          subject: 'Sign in to your account',
          html: `<p>Click the link below to sign in:</p><p><a href="${url}">Sign in</a></p>`,
        })
      },
    }),
    nextCookies(), // make sure this is the last plugin in the array
  ],
})
