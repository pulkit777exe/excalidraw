"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { useRoomStore, useAuthStore } from "@repo/store";
import { Input, Button, Card, Avatar } from "@repo/ui";

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
  // Remove control characters except tab(\t), newline(\n), carriage return(\r)
  value = value.replace(new RegExp("[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "g"), "");
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
  userName,
}: {
  messages: Message[];
  id: string;
  token: string;
  userName: string;
}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const { socket, loading, error } = useSocket(token);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasJoinedRoom = useRef(false);

  // Store hooks
  const { 
    messages: storeMessages, 
    addMessage, 
    setMessages, 
    setConnected, 
    setError: setRoomError,
    clearError: clearRoomError 
  } = useRoomStore();

  const { user } = useAuthStore();

  // Initialize messages from props
  useEffect(() => {
    setMessages(messages);
  }, [messages, setMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storeMessages]);

  // Join room and handle messages
  useEffect(() => {
    if (socket && !loading && !hasJoinedRoom.current) {
      hasJoinedRoom.current = true;
      setConnected(true);
      
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
            const newMessage: Message = {
              message: String(parsedData.message || ""),
              user: parsedData.user || { id: parsedData.userId, name: userName, email: "" },
              createdAt: new Date().toISOString(),
            };
            addMessage(newMessage);
          }
        } catch (err) {
          console.error("Error parsing message:", err);
          setRoomError("Failed to parse message");
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
        setConnected(false);
      }
    };
  }, [socket, loading, id, userName, addMessage, setConnected, setRoomError]);

  const sendMessage = () => {
    const clean = sanitizeMessage(currentMessage);
    if (!clean || !socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: id,
        message: clean,
        user: { name: userName }, // Include user name for display
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
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Connection Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {storeMessages.map((chat, index) => (
          <Card key={chat.id || index} variant="glass" className="p-4">
            {chat.user && (
              <div className="flex items-center gap-2 mb-2">
                <Avatar name={chat.user.name} size="sm" />
                <span className="font-semibold text-sm text-white">{chat.user.name}</span>
                {chat.createdAt && (
                  <span className="text-xs text-neutral-400">
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
            <p className="text-neutral-200">{chat.message}</p>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="border-t border-neutral-700 bg-neutral-900 p-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!socket || socket.readyState !== WebSocket.OPEN}
            maxLength={1000}
          />
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN}
            variant="primary"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}