import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";
import { SignInSchema, UserSchema } from "@repo/common-config/config";
import { middleware } from "./middleware";

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3008;
const BCRYPT_ROUNDS = 12;
const CHAT_MESSAGES_LIMIT = 50;

if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    process.exit(1);
}

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));

// Types
interface AuthenticatedRequest extends Request {
    userId?: string;
}

// Utility functions
const createErrorResponse = (message: string, statusCode: number = 400) => ({
    success: false,
    message,
    timestamp: new Date().toISOString()
});

const createSuccessResponse = (data: any, message?: string) => ({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
});

// Auth Routes
app.post('/api/auth/signup', async (req: Request, res: Response) => {
    try {
        const {success, data, error } = UserSchema.safeParse(req.body);

        if (!success) {
            return res.status(400).json(
                createErrorResponse("Invalid input", 400)
            );
        }

        const { email, password, name } = data;

        // Check if user already exists
        const existingUser = await prismaClient.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.status(409).json(
                createErrorResponse("User with this email already exists", 409)
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // Create user
        const newUser = await prismaClient.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name: name.trim()
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });

        return res.status(201).json(
            createSuccessResponse(
                { 
                    user: newUser 
                },
                "User created successfully"
            )
        );

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json(
            createErrorResponse("Internal server error", 500)
        );
    }
});

app.post('/api/auth/signin', async (req: Request, res: Response) => {
    try {
        const parsed = SignInSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json(
                createErrorResponse("Invalid input", 400)
            );
        }

        const { email, password } = parsed.data;

        // Find user
        const user = await prismaClient.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
                id: true,
                email: true,
                name: true,
                password: true
            }
        });

        if (!user) {
            return res.status(401).json(
                createErrorResponse("Invalid email or password", 401)
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json(
                createErrorResponse("Invalid email or password", 401)
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id,
                email: user.email 
            },
            JWT_SECRET,
            { 
                expiresIn: '7d',
                issuer: 'chat-app'
            }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return res.json(
            createSuccessResponse(
                {
                    user: userWithoutPassword,
                    token
                },
                "Sign-in successful"
            )
        );

    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json(
            createErrorResponse("Internal server error", 500)
        );
    }
});

// Chat Routes
app.get("/api/chats/:roomId", middleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const roomId = parseInt(req.params.roomId);

        if (isNaN(roomId) || roomId <= 0) {
            return res.status(400).json(
                createErrorResponse("Invalid room ID", 400)
            );
        }

        // Verify user has access to this room (add your own logic here)
        const room = await prismaClient.room.findUnique({
            where: { id: roomId },
            select: { id: true }
        });

        if (!room) {
            return res.status(404).json(
                createErrorResponse("Room not found", 404)
            );
        }

        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                createdAt: "desc"
            },
            take: CHAT_MESSAGES_LIMIT,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return res.json(
            createSuccessResponse(
                { 
                    messages: messages.reverse(), // Reverse to get chronological order
                    roomId,
                    count: messages.length
                },
                "Messages retrieved successfully"
            )
        );

    } catch (error) {
        console.error("Get chats error:", error);
        return res.status(500).json(
            createErrorResponse("Failed to retrieve messages", 500)
        );
    }
});

app.get("/api/room/:slug", middleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { slug } = req.params;

        if (!slug || typeof slug !== 'string') {
            return res.status(400).json(
                createErrorResponse("Invalid room slug", 400)
            );
        }

        const room = await prismaClient.room.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!room) {
            return res.status(404).json(
                createErrorResponse("Room not found", 404)
            );
        }

        return res.json(
            createSuccessResponse(
                { room },
                "Room retrieved successfully"
            )
        );

    } catch (error) {
        console.error("Get room error:", error);
        return res.status(500).json(
            createErrorResponse("Failed to retrieve room", 500)
        );
    }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
    res.status(404).json(
        createErrorResponse("Route not found", 404)
    );
});

// Global error handler
app.use((error: Error, req: Request, res: Response, next: any) => {
    console.error("Unhandled error:", error);
    res.status(500).json(
        createErrorResponse("Internal server error", 500)
    );
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prismaClient.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await prismaClient.$disconnect();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api`);
});