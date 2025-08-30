import { z } from "zod";

export const contactSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  name: z.string().min(1, { message: "Name is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  restaurant_name: z.string().optional(),
});
