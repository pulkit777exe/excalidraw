import express from "express";
import bcrypt from "bcryptjs";
import { prismaClient } from "@repo/db/client";
import { SignInSchema, UserSchema } from "@repo/common-config/config";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

const app = express();
app.use(express.json());

app.post('/signup', async (req: Request, res:Response) => {
    const parsed = UserSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: parsed.error.errors
        });
    }

    const { email, password, name } = parsed.data;

    try {
        const existingUser = await prismaClient.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        return res.json({
            message: "User created successfully",
            userId: newUser.id
        });
    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/signin', async (req, res) => {
    const parsed = SignInSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    const { email, password } = parsed.data;

    try {
        const user = await prismaClient.user.findUnique({
            where: { email: parsed.data.email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({
            userId: user?.id
        }, JWT_SECRET || "fallback-secret")

        return res.json({
            message: "Sign-in successful",
            userId: user.id,
            token: token
        });
    } catch (err) {
        console.error("Signin Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/chats/:roomId", middleware, async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get("/room/:slug", middleware, async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room: room.id
    })
})

// Fix for the TypeScript error - use proper callback signature
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});