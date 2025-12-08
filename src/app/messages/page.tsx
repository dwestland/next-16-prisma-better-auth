"use client";

import { useState } from "react";
import { z } from "zod";
import { sendMessage } from "./actions";

const messageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof messageSchema>, string>>;

export default function MessagesPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = messageSchema.safeParse({ name, email, message });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FieldErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus({ type: "loading" });
    const response = await sendMessage(result.data);

    if (response.success) {
      setStatus({ type: "success", message: "Message sent successfully!" });
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setStatus({ type: "error", message: response.error });
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-2xl font-bold">Messages</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status.type === "loading"}
            className="w-full rounded bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status.type === "loading" ? "Sending..." : "Send Message"}
          </button>

          {status.type === "success" && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {status.message}
            </p>
          )}

          {status.type === "error" && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {status.message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
