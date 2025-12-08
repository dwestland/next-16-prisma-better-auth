"use server";

import { z } from "zod";
import { Resend } from "resend";
import { db } from "@/lib/db";

const messageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required"),
});

type MessageInput = z.infer<typeof messageSchema>;

export async function sendMessage(input: MessageInput) {
  try {
    const validated = messageSchema.parse(input);

    const resend = new Resend(process.env.AUTH_RESEND_KEY);

    await resend.emails.send({
      from: process.env.AUTH_RESEND_FROM!,
      to: process.env.AUTH_RESEND_FROM!,
      subject: `New message from ${validated.name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${validated.name}</p>
        <p><strong>Email:</strong> ${validated.email}</p>
        <p><strong>Message:</strong></p>
        <p>${validated.message}</p>
      `,
    });

    await db.message.create({
      data: {
        name: validated.name,
        email: validated.email,
        message: validated.message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[sendMessage]", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to send message" };
  }
}
