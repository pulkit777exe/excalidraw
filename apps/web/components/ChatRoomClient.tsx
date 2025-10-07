"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";

interface Message {
  id?: string;
  message: string;
  createdAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

function sanitizeMessage(raw: string, maxLen = 1000): string {
  let value = raw.normalize();
  // Remove control characters except tab/newline/carriage return
  value = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  // Collapse consecutive spaces
  value = value.replace(/\s{3,}/g, "  ");
  // Trim and slice
  value = value.trim().slice(0, maxLen);
  return value;
}

export function ChatRoomClient({
  messages,
  id,
  token,
}: {
  messages: Message[];
  id: string;
  token: string;
}) {
  const [chats, setChats] = useState<Message[]>(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const { socket, loading, error } = useSocket(token);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasJoinedRoom = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  // Join room and handle messages
  useEffect(() => {
    if (socket && !loading && !hasJoinedRoom.current) {
      hasJoinedRoom.current = true;
      
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          if (parsedData.type === "chat") {
            setChats((prev) => [
              ...prev,
              {
                message: String(parsedData.message || ""),
                user: parsedData.user,
                createdAt: new Date().toISOString(),
              },
            ]);
          }
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      };
    }

    return () => {
      if (socket && hasJoinedRoom.current) {
        socket.send(
          JSON.stringify({
            type: "leave_room",
            roomId: id,
          })
        );
      }
    };
  }, [socket, loading, id]);

  const sendMessage = () => {
    const clean = sanitizeMessage(currentMessage);
    if (!clean || !socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: id,
        message: clean,
      })
    );

    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-neutral-950 to-neutral-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-neutral-950 to-neutral-900">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Connection Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-neutral-950 via-zinc-900 to-neutral-900">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats.map((chat, index) => (
          <div
            key={chat.id || index}
            className="bg-white/5 border border-white/10 rounded-lg p-4 shadow backdrop-blur-sm"
          >
            {chat.user && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-black font-bold">
                  {chat.user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-sm text-zinc-100">{chat.user.name}</span>
                {chat.createdAt && (
                  <span className="text-xs text-zinc-400">
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
            <p className="text-zinc-100 whitespace-pre-wrap">{chat.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="border-t border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            maxLength={1000}
            className="flex-1 px-4 py-2 bg-black/30 text-white placeholder-zinc-400 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300"
            disabled={!socket}
          />
          <button
            onClick={sendMessage}
            disabled={!sanitizeMessage(currentMessage) || !socket}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}