import { WebSocket, WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });
const JWT_SECRET = process.env.JWT_SECRET!;

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch(e) {
    return null;
  }
}

function broadcastToRoom(roomId: string, message: any, excludeUserId?: string) {
  users.forEach((user) => {
    if (user.rooms.includes(roomId) && user.userId !== excludeUserId) {
      user.ws.send(JSON.stringify(message));
    }
  });
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) return;
  
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return;
  }

  users.push({ userId, rooms: [], ws });

  ws.on('message', async function message(data) {
    let parsedData;
    try {
      parsedData = JSON.parse(data.toString());
    } catch (e) {
      console.error("Invalid JSON", e);
      return;
    }

    switch (parsedData.type) {
      case "join_room":
        const user = users.find(x => x.ws === ws);
        if (user && !user.rooms.includes(parsedData.roomId)) {
          user.rooms.push(parsedData.roomId);
        }
        break;

      case "leave_room":
        const leavingUser = users.find(x => x.ws === ws);
        if (leavingUser) {
          leavingUser.rooms = leavingUser.rooms.filter(x => x !== parsedData.roomId);
        }
        break;

      case "chat":
        await prismaClient.chat.create({
          data: {
            userId,
            roomId: parsedData.roomId,
            message: parsedData.message
          }
        });
        broadcastToRoom(parsedData.roomId, {
          type: "chat",
          message: parsedData.message,
          roomId: parsedData.roomId,
          userId
        }, userId);
        break;

      case "shape_added":
      case "shape_removed":
      case "shape_updated":
      case "cursor_move":
        broadcastToRoom(parsedData.roomId, parsedData, userId);
        break;

      case "state_sync":
        broadcastToRoom(parsedData.roomId, parsedData, userId);
        break;
    }
  });

  ws.on('close', () => {
    const index = users.findIndex(x => x.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});

console.log("WebSocket server running on ws://localhost:8080");