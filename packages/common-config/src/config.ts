import z from "zod";

export const UserSchema = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string()
})

export const SignInSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const RoomSchema = z.object({
    roomId: z.string()
})