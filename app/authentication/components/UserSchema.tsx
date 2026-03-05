import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255, "Name cannot exceed 255 characters"),
  email: z.email("Invalid email").max(255,"Email too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(255,"Password too long"),
  role: z.enum(['user', 'admin']).default("user")
})

export const loginSchema = userSchema.pick({
  email: true,
  password: true,
});


export type User = z.infer<typeof userSchema>
export type UserLogin = z.infer<typeof loginSchema>