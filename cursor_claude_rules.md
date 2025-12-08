# Rules for Cursor and Claude Code

These rules govern how all code should be written, reviewed, and generated in Cursor and Claude Code. They enforce consistency, maintainability, security, and production-readiness across the entire codebase.

## Tech Stack

- **Next.js 16** - App Router, Server Components, Server Actions
- **React 19** - With React Compiler 1.0
- **Tailwind CSS 4** - Utility-first styling
- **TypeScript 5** - Strict type safety
- **Prisma 6** - Database ORM
- **Better Auth 1** - Authentication with database sessions
- **React Query** - Server state management
- **react-hook-form** - Form handling
- **zod** - Schema validation
- **react-hot-toast** - Toast notifications

## 0. Change Review & Communication

For significant changes, provide:

- Purpose and context of the change.
- Code example when helpful for clarity.
- Impact assessment (affected features, breaking changes).
- Request clarification when context is missing (via @ references or updates in status.md).

Example:

```
Change: Added server action for updating user profiles.
Purpose: Supports profile edits from the dashboard.
Impact: Requires revalidation of /dashboard routes.
Snippet:
"use server";
export async function updateUserProfile(input: UpdateProfileInput) { ... }
```

If context is missing:

```
I need more information. Please provide the relevant file path (e.g., @app/dashboard/page.tsx) or describe the expected behavior in status.md.
```

## 1. Architecture & Rendering

- Default to React Server Components (RSC).
- Use `use client` only when interactivity is required.
- Prefer Next.js Server Actions for all data mutations.
- Follow Next.js 16 App Router patterns for routing, caching, and revalidation.
- Use next/dynamic for non-critical or client-only components.
- Export components using named exports.
- All components must be functional components written in TypeScript.

Minimal example:

```typescript
"use server";
export async function updateUser(data: UpdateUserInput) {
  const validated = userSchema.parse(data);
  const result = await db.user.update(validated);
  revalidatePath("/dashboard");
  return { success: true, data: result };
}
```

## 2. Performance & Scalability

- **With React Compiler 1.0 enabled**: Manual memoization (React.memo, useCallback, useMemo) is often unnecessary. Use them only when profiling shows clear benefit.
- **If React Compiler is disabled**: Follow traditional optimization patterns with React.memo, useCallback, and useMemo.
- Avoid inline object/function creation inside JSX when it affects performance.
- Lazy-load non-essential UI using dynamic imports and Suspense.
- Use next/image with explicit width/height or fill with sizes.
- Analyze bundles with @next/bundle-analyzer.
- Use Edge Runtime where appropriate (middleware, edge routes).

Example with React Compiler disabled:

```typescript
const MemoizedCard = React.memo(function Card({ title }: { title: string }) {
  return <div>{title}</div>;
});
```

## 3. Error, Loading & Edge Case Handling

- Wrap all async operations in try/catch.
- All data-fetching components must include loading, error, and fallback UI states.
- Use Suspense for async components.
- Server Actions must return typed success/error objects.

Example:

```typescript
"use server";
export async function updateUser(data: UpdateUserInput) {
  try {
    const validated = userSchema.parse(data);
    const result = await db.user.update(validated);
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    console.error("[updateUser]", error);
    return { success: false, error: "Failed to update user" };
  }
}
```

Client-side example:

```typescript
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
} catch (error) {
  return <ErrorMessage message="Unable to load content." />;
}
```

## 4. Authentication & Authorization (Better Auth 1)

- Use Better Auth 1 with database-backed sessions.
- Role hierarchy: ADMIN > MANAGER > USER.
- Secure routes at page, server action, and middleware layers.
- Use client-side auth hooks only when needed for UI state.

Middleware protection:

```typescript
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

Server Component protection:

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") return <Forbidden />;

  return <AdminDashboard />;
}
```

Server Action protection:

```typescript
"use server";
export async function adminAction(data: AdminInput) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }
  // ... perform admin action
}
```

## 5. Type Safety & Interfaces

- Define Zod schemas for all external data (API responses, form inputs, environment variables).
- Derive TypeScript types from schemas using `z.infer<typeof schema>`.
- Validate at boundaries: API routes, Server Actions, external APIs.
- Define interfaces for all props and data models.
- Never use `any`; prefer `unknown` + type guards.
- Use union types for constrained values.
- Reusable components must accept `className?: string`.
- Provide default values in destructuring.

Example:

```typescript
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["USER", "MANAGER", "ADMIN"]),
});

type User = z.infer<typeof userSchema>;

interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export function Button({ label, onClick, className = "" }: ButtonProps) {
  return (
    <button onClick={onClick} className={className}>
      {label}
    </button>
  );
}
```

## 6. Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile`, `DashboardCard`)
- **Files**: PascalCase for components (`Button.tsx`), camelCase for utilities (`formatDate.ts`)
- **Variables/functions**: camelCase (e.g., `userData`, `fetchUsers`)
- **Booleans**: `is` / `has` / `should` prefix (e.g., `isLoading`, `hasPermission`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_RETRIES`, `API_BASE_URL`)
- **Types/interfaces**: PascalCase (e.g., `UserProfile`, `ApiResponse`)
- **Event handlers**: `handle` prefix (e.g., `handleSubmit`, `handleClick`)
- **Server Actions**: Descriptive verb + noun (e.g., `createUser`, `updateProfile`, `deletePost`)

Example:

```typescript
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
const isAuthenticated = Boolean(session);

const handleSubmit = async () => {
  // ...
};
```

## 7. Event Handler Rules

- Handlers must be prefixed with `handle`.
- Type all handlers explicitly.
- Use callback props when designing reusable components.
- Prevent default behavior explicitly when needed.

Example:

```typescript
const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  e.preventDefault();
  // handle logic
};

const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  setValue(e.target.value);
};
```

## 8. Coding Style

- Use early returns to reduce nesting.
- Use Tailwind CSS core utility classes only; avoid arbitrary values unless necessary.
- Prefer semantic color names: `text-primary-600` over `text-blue-600`.
- Extract complex class combinations into components, not `@apply`.
- Keep functions single-responsibility.
- Prefer top-level function declarations for utilities.
- Avoid inline styles unless dynamically required.

Example:

```typescript
export function UserCard({ user }: { user: User | null }) {
  if (!user) return null;
  if (!user.isActive) return <InactiveUser />;

  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:border-gray-300">
      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
      <p className="text-sm text-gray-600">{user.email}</p>
    </div>
  );
}
```

## 9. File Structure & Organization

- Group by feature, not by type: `/app/dashboard/components`, not `/components/dashboard`
- Collocate related files: `Button.tsx`, `Button.test.tsx`, `Button.stories.tsx`
- Use `index.ts` for clean exports from feature directories
- Server Actions in separate `actions.ts` files per feature
- Keep shared utilities in `/lib`
- Keep shared components in `/components/ui`

Example structure:

```
/app
  /dashboard
    /components
      UserCard.tsx
      UserCard.test.tsx
    actions.ts
    page.tsx
    layout.tsx
/lib
  /auth
    auth.ts
    session.ts
  /utils
    formatDate.ts
    validation.ts
/components
  /ui
    Button.tsx
    Input.tsx
```

## 10. Testing

### Unit + Component Testing (Vitest + React Testing Library)

- Write unit tests for utilities and pure functions.
- Write component tests for UI components with user interactions.
- Use Vitest as the test runner.
- Use React Testing Library (RTL) for component testing.
- Test user behavior, not implementation details.
- Aim for >80% coverage on business logic.

Example:

```typescript
// formatDate.test.ts
import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats date correctly", () => {
    const result = formatDate(new Date("2025-01-15"));
    expect(result).toBe("Jan 15, 2025");
  });
});
```

Component test example:

```typescript
// Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Integration & E2E Testing (Playwright)

- Write integration tests for Server Actions and API routes.
- Write E2E tests for critical user flows (auth, checkout, data entry).
- Use Playwright for E2E testing.
- Test happy paths and error scenarios.
- Run E2E tests in CI/CD pipeline.

Example:

```typescript
// auth.spec.ts
import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', "user@example.com");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator("h1")).toContainText("Dashboard");
});
```

## 11. Documentation & Git Hygiene

- Use JSDoc for complex logic and public APIs.
- Keep README.md and status.md updated when architecture changes.
- Use conventional commits (e.g., `feat:`, `fix:`, `docs:`, `refactor:`).
- Keep commits atomic and focused on a single change.

Example:

```typescript
/**
 * Validates a user profile and returns sanitized output.
 * @param input - Raw user input from form
 * @returns Validated and sanitized user data
 * @throws {ValidationError} When input fails schema validation
 */
export function validateUserProfile(input: unknown): UserProfile {
  return userProfileSchema.parse(input);
}
```

Git commit examples:

```
feat: add user profile update functionality
fix: resolve race condition in auth middleware
docs: update API documentation for user endpoints
refactor: extract validation logic into separate module
```

## 12. Fetch API & Data Fetching

Create separate files for fetch functionality to maintain consistency and error handling.

### Fetch Utilities File (`/lib/api/fetch.ts`)

```typescript
import { z } from "zod";

export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Enhanced fetch with error handling, timeout, and validation
 */
export async function apiFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        `API error: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }
    throw new ApiError("Network error", 0);
  }
}

/**
 * Fetch with schema validation
 */
export async function apiFetchValidated<T>(
  url: string,
  schema: z.ZodSchema<T>,
  options: FetchOptions = {}
): Promise<T> {
  const data = await apiFetch<unknown>(url, options);
  return schema.parse(data);
}
```

### Usage Example

```typescript
import { apiFetchValidated } from "@/lib/api/fetch";
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>;

export async function getUser(id: string): Promise<User> {
  return apiFetchValidated(`/api/users/${id}`, userSchema, { method: "GET" });
}
```

## 13. API Endpoints & Route Handlers

Create separate files for API route handlers with consistent error handling.

### API Route Structure (`/app/api/users/[id]/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("[GET /api/users/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = userUpdateSchema.parse(body);

    const user = await db.user.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[PATCH /api/users/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### API Response Types (`/lib/api/types.ts`)

```typescript
export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

## 14. Operational Standards

- Store secrets only in `.env` (local) and Vercel environment variables (production).
- Code must run on Vercel, AWS, or Netlify without modification.
- Use Sentry or equivalent for error logging in production.
- Run `npm audit` regularly and address vulnerabilities.
- Test builds locally with `npm run build` before deploying.
- Configure proper caching strategies in `next.config.ts`.
- Use Vercel Analytics or similar for performance monitoring.

Example `.env`:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=XXX
NEXTAUTH_URL=http://localhost:3000
```

## 15. Accessibility

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<article>`).
- Use proper ARIA attributes when semantic HTML is insufficient.
- Maintain keyboard navigation support (tab order, focus states).
- Ensure focus visibility with proper focus styles.
- Ensure WCAG-compliant color contrast (4.5:1 for normal text).
- Provide alt text for all images.
- Use labels for all form inputs.

Example:

```typescript
<button
  type="button"
  aria-label="Close dialog"
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
  onClick={handleClose}
>
  <XIcon className="h-5 w-5" aria-hidden="true" />
</button>
```

## 16. Security (Mandatory)

Security must always be prioritized.  
Any code involving user input, authentication, file uploads, or sensitive data requires a `<SECURITY_REVIEW>`.

### Trigger <SECURITY_REVIEW> for:

- User input (forms, URL params, search params)
- Authentication/authorization checks
- File uploads or downloads
- Database queries with user data
- API endpoints
- Environment variables or secrets
- Third-party integrations
- Payment processing
- Email sending with user data

### 16.1 Vulnerability Identification

Identify risks including:

- **XSS** (Cross-Site Scripting)
- **CSRF** (Cross-Site Request Forgery)
- **SQL Injection**
- **Input tampering**
- **Unauthorized access**
- **File upload risks**
- **Secret leakage**
- **Authentication bypass**
- **Broken access control**

Example:

```
<SECURITY_REVIEW>
Potential vulnerabilities:
- XSS via user-generated content in comments
- Missing validation allows malformed email payloads
- File upload accepts any file type
</SECURITY_REVIEW>
```

### 16.2 Mitigation Strategies

- **Validate all input** using zod schemas.
- **Escape/sanitize** all user-generated content before rendering.
- **Use secure HTTP headers** (CSP, X-Frame-Options, etc.).
- **Use Next.js CSRF protections** built into Server Actions.
- **Avoid** `eval`, `new Function`, unsanitized `dangerouslySetInnerHTML`.
- **Use parameterized queries** with Prisma (never string concatenation).
- **Hash passwords** with bcrypt or similar (Better Auth handles this).
- **Limit file upload sizes** and validate MIME types.
- **Use HTTPS** in production.
- **Implement rate limiting** for sensitive endpoints.

Example:

```typescript
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  userId: z.string().uuid(),
});

("use server");
export async function createComment(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = commentSchema.parse(input);

  // Additional check: user can only comment as themselves
  if (validated.userId !== session.user.id) {
    return { success: false, error: "Forbidden" };
  }

  // Prisma automatically escapes values
  const comment = await db.comment.create({
    data: {
      content: validated.content,
      userId: validated.userId,
    },
  });

  revalidatePath("/posts");
  return { success: true, data: comment };
}
```

### 16.3 Required References

Every security review must reference at least one of:

- **OWASP Top 10** (https://owasp.org/www-project-top-ten/)
- **Next.js Security Docs** (https://nextjs.org/docs/app/building-your-application/configuring/security)
- **Better Auth Security Guidelines** (https://www.better-auth.com/docs/security)

Example:

```
<SECURITY_REVIEW>
Vulnerabilities: XSS in user comments, unauthorized file access
Mitigations: zod validation, Prisma parameterized queries, role-based access control
References: OWASP Top 10 (A03:2021 - Injection, A01:2021 - Broken Access Control)
</SECURITY_REVIEW>
```

### 16.4 Secure Defaults

**Always use:**

- `zod` for validation
- Helmet or Next.js security headers
- HTTPS in production
- httpOnly cookies for sessions (Better Auth default)
- Parameterized queries (Prisma default)

**Never use:**

- `eval()`
- `new Function()`
- `dangerouslySetInnerHTML` without sanitization
- Raw SQL queries with string concatenation
- Unvalidated user input in database queries

## 17. Clarification Requests

If context is missing, always request clarification before proceeding:

```
I need additional context to proceed:
- Please provide the relevant file path (e.g., @app/dashboard/page.tsx)
- Or add implementation details in status.md
- Or clarify the expected behavior
```

Do not make assumptions about:

- Database schema when not provided
- Authentication requirements when unclear
- Business logic when ambiguous
- User permissions when not specified

## 18. How Claude Code Must Generate Output

- **Output final code only** unless explanation is explicitly requested.
- **Follow all conventions** in this rules file without exception.
- **Use Tailwind CSS**; avoid inline styles unless dynamically required.
- **Maintain strict type safety**; never introduce `any`.
- **Do not remove** error handling, loading states, or security checks unless explicitly instructed.
- **Respect existing file architecture** and import patterns.
- **Include security reviews** when handling sensitive operations.
- **Provide complete, runnable code** without placeholders or TODOs unless specifically requested.

### Output Format

When providing code changes:

1. State what you're changing and why
2. Show the complete code file or function
3. Include all necessary imports
4. Ensure proper error handling
5. Add security review if applicable
6. Mention any environment variables or configuration needed

---

# End of Rules File

**Version**: 1.0  
**Last Updated**: December 2025  
**Maintained by**: Development Team
