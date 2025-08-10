import z from "zod";
import { email } from "zod/v4";

export const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
    name: z.string()
})

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20)
})

export const RoomSchema = z.object({
    roomId: z.string().max(12)
})