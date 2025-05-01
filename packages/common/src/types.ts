import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string(),
    password: z.string().min(6).max(20),
    username: z.string().min(6).max(20)
})

export const SigninUserSchema = z.object({
    email: z.string(),
    password: z.string().min(6).max(20)
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
}) 