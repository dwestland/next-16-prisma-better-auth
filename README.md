# next-16-prisma-better-auth

A production-ready starter template for building modern web applications with Next.js 16, Prisma 7, and Better Auth.

## Description

This repository serves as scaffolding for new projects that require a robust authentication system with role-based access control. It provides a complete authentication setup out of the box, allowing you to focus on building your application's core features rather than implementing auth from scratch.

## Features

- **Multiple Authentication Methods**

  - Email/Password authentication
  - Google OAuth
  - GitHub OAuth
  - Magic Link (passwordless) authentication via email

- **Role-Based Access Control (RBAC)**

  - User roles: USER, CLIENT, MANAGER, ADMIN
  - Protected routes with role-based restrictions
  - Admin-only pages

- **Route Protection**

  - Next.js 16 `proxy.ts` for centralized route protection
  - Server-side session validation
  - Automatic redirect to sign-in for unauthenticated users

- **Modern UI**
  - Responsive sign-in and sign-up pages
  - Session-aware navigation
  - User profile display with avatar support

## Technologies

| Technology                                    | Version | Purpose                         |
| --------------------------------------------- | ------- | ------------------------------- |
| [Next.js](https://nextjs.org/)                | 16      | React framework with App Router |
| [Prisma](https://www.prisma.io/)              | 7       | Database ORM with PostgreSQL    |
| [Better Auth](https://www.better-auth.com/)   | 1.x     | Authentication library          |
| [Resend](https://resend.com/)                 | -       | Email delivery for Magic Links  |
| [TypeScript](https://www.typescriptlang.org/) | 5.x     | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com/)      | 4.x     | Styling                         |

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/next-16-prisma-better-auth.git
   cd next-16-prisma-better-auth
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy the example environment file and configure your variables:

   ```bash
   cp .env.example .env
   ```

   Required environment variables:

   ```env
   # Prisma database connection string
   DATABASE_URL=postgresql://username:password@hostname:5432/database_name?schema=public

   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # Better Auth configuration
   BETTER_AUTH_SECRET=xxx
   BETTER_AUTH_URL=http://localhost:3000

   # Better Auth GitHub OAuth Provider
   GITHUB_CLIENT_ID=xxx
   GITHUB_CLIENT_SECRET=xxx

   # Better Auth Google OAuth Provider
   GOOGLE_CLIENT_ID=xxx
   GOOGLE_CLIENT_SECRET=xxx

   # Email Credentials
   RESEND_API_KEY=xxx
   EMAIL_FROM=xxx
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

## Usage

1. **Start the development server**

   ```bash
   pnpm dev
   ```

2. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Available Routes**

   | Route       | Access        | Description                             |
   | ----------- | ------------- | --------------------------------------- |
   | `/`         | Public        | Home page with user info when logged in |
   | `/signin`   | Public        | Sign in page                            |
   | `/signup`   | Public        | Sign up page                            |
   | `/user`     | Authenticated | Protected user page                     |
   | `/admin`    | Admin only    | Admin-restricted page                   |
   | `/messages` | Public        | Contact form                            |

4. **Customizing for your project**

   - Update `package.json` with your project name
   - Modify the Prisma schema in `prisma/schema.prisma` to add your models
   - Add new protected routes to `src/proxy.ts`
   - Customize the UI components in `src/app/` and `src/components/`

## Project Structure

```
src/
├── app/
│   ├── actions/          # Server actions (auth)
│   ├── admin/            # Admin page (ADMIN role only)
│   ├── api/auth/         # Better Auth API routes
│   ├── messages/         # Contact form page
│   ├── signin/           # Sign in page & components
│   ├── signup/           # Sign up page & components
│   ├── user/             # Protected user page
│   ├── layout.tsx        # Root layout with TopNav
│   └── page.tsx          # Home page
├── components/
│   └── TopNav.tsx        # Navigation component
├── lib/
│   ├── auth.ts           # Better Auth server config
│   ├── auth-client.ts    # Better Auth client config
│   └── db.ts             # Prisma client
└── proxy.ts              # Route protection middleware
```

## License

MIT
