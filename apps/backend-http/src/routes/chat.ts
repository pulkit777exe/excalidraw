import { Router, Response } from "express";
import { prismaClient } from "@repo/db";
import { createErrorResponse, createSuccessResponse } from "../utils/responses";
import { AuthenticatedRequest, authMiddleware } from "../middleware/auth";
import dotenv from "dotenv";

dotenv.config()

const chatRoutes: Router = Router();
const CHAT_MESSAGES_LIMIT = 50;

const parseRoomId = (roomIdStr: string): number | null => {
  const roomId = parseInt(roomIdStr, 10);
  return isNaN(roomId) || roomId <= 0 ? null : roomId;
};

const roomExists = async (roomId: number): Promise<boolean> => {
  const room = await prismaClient.room.findUnique({
    where: { id: roomId },
    select: { id: true },
  });
  return !!room;
};

chatRoutes.get(
  "/chats/:roomId",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const roomIdStr = req.params.roomId || "";
      const roomId = parseRoomId(roomIdStr);
      
      if (roomId === null) {
        res.status(400).json(
          createErrorResponse("Invalid room ID. Must be a positive integer")
        );
        return;
      }

      const exists = await roomExists(roomId);
      if (!exists) {
        res.status(404).json(createErrorResponse("Room not found", 404));
        return;
      }

      const messages = await prismaClient.chat.findMany({
        where: { roomId },
        take: CHAT_MESSAGES_LIMIT,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const orderedMessages = messages.reverse();

      res.json(
        createSuccessResponse(
          {
            messages: orderedMessages,
            roomId,
            count: orderedMessages.length,
            hasMore: messages.length === CHAT_MESSAGES_LIMIT,
          },
          "Messages retrieved successfully"
        )
      );
    } catch (error) {
      console.error("Get chats error:", {
        roomId: req.params.roomId,
        userId: req.userId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      res.status(500).json(
        createErrorResponse("Failed to retrieve messages", 500)
      );
    }
  }
);

chatRoutes.get(
  "/room/:slug",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;

      if (!slug || slug.trim().length === 0) {
        res.status(400).json(
          createErrorResponse("Invalid slug format")
        );
        return;
      }

      const room = await prismaClient.room.findUnique({
        where: { slug: slug.toLowerCase() },
        select: {
          id: true,
          slug: true,
          name: true,
          createdAt: true,
          _count: {
            select: {
              chats: true,
            },
          },
        },
      });

      if (!room) {
        res.status(404).json(createErrorResponse("Room not found", 404));
        return;
      }

      res.json(
        createSuccessResponse(
          { room },
          "Room retrieved successfully"
        )
      );
    } catch (error) {
      console.error("Get room error:", {
        slug: req.params.slug,
        userId: req.userId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      res.status(500).json(
        createErrorResponse("Failed to retrieve room", 500)
      );
    }
  }
);

export default chatRoutes;