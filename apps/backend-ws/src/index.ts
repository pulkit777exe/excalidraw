import { WebSocket, WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db";

const PORT = parseInt(process.env.WS_PORT || "8080", 10);
const wss = new WebSocketServer({ port: PORT });
const JWT_SECRET = process.env.JWT_SECRET!;

wss.on('error', (err: any) => {
  if (err && (err.code === 'EADDRINUSE' || err.errno === -98)) {
    console.error(`WebSocket port ${PORT} is already in use. Set WS_PORT to a free port or stop the other process.`);
  } else {
    console.error("WebSocket server error:", err);
  }
  process.exit(1);
});

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return null;
    }
    return String(decoded.userId);
  } catch(e) {
    return null;
  }
}

function broadcastToRoom(roomId: string, message: any, excludeUserId?: string) {
  users.forEach((user) => {
    if (user.rooms.includes(roomId) && user.userId !== excludeUserId) {
      try {
        user.ws.send(JSON.stringify(message));
      } catch {}
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
    let parsedData: any;
    try {
      parsedData = JSON.parse(data.toString());
    } catch (e) {
      console.error("Invalid JSON", e);
      return;
    }

    const type = parsedData?.type;
    const roomId = String(parsedData?.roomId || "");
    if (!type || !roomId) return;

    switch (type) {
      case "join_room": {
        const user = users.find(x => x.ws === ws);
        if (user && !user.rooms.includes(roomId)) {
          user.rooms.push(roomId);
        }
        break;
      }

      case "leave_room": {
        const leavingUser = users.find(x => x.ws === ws);
        if (leavingUser) {
          leavingUser.rooms = leavingUser.rooms.filter(x => x !== roomId);
        }
        break;
      }

      case "chat": {
        try {
          const roomIdNum = Number(roomId);
          if (Number.isFinite(roomIdNum)) {
            await prismaClient.chat.create({
              data: {
                userId: String(userId),
                roomId: roomIdNum,
                message: String(parsedData.message || ""),
              }
            });
          }
        } catch (e) {
          console.error("Failed to persist chat", e);
        }
        broadcastToRoom(roomId, {
          type: "chat",
          message: parsedData.message,
          roomId,
          userId
        }, userId);
        break;
      }

      case "shape_added":
      case "shape_removed":
      case "shape_updated":
      case "cursor_move":
      case "state_sync": {
        broadcastToRoom(roomId, parsedData, userId);
        break;
      }
    }
  });

  ws.on('close', () => {
    const index = users.findIndex(x => x.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);