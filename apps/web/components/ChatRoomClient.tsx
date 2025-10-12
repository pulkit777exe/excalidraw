"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { useRoomStore } from "@repo/store";
import { Input, Button, Card, Avatar } from "@repo/ui";

interface Message {
  id: string;
  message: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function sanitizeMessage(raw: string, maxLen = 1000): string {
  let value = raw.normalize();
  // Remove control characters except tab(\t), newline(\n), carriage return(\r)
  // Filter out control characters manually to avoid ESLint warnings
  value = value.split('').filter(char => {
    const code = char.charCodeAt(0);
    // Keep printable characters, tab, newline, carriage return
    return code >= 32 || code === 9 || code === 10 || code === 13;
  }).join('');
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
    setError: setRoomError
  } = useRoomStore();

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
              id: Math.random().toString(36).substr(2, 9),
              message: String(parsedData.message || ""),
              userId: parsedData.userId || parsedData.user?.id || "unknown",
              user: parsedData.user || { id: parsedData.userId || "unknown", name: userName, email: "" },
              createdAt: new Date(),
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
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "var(--matty-black)"
      }}>
        <div style={{
          animation: "spin 1s linear infinite",
          borderRadius: "50%",
          height: "3rem",
          width: "3rem",
          borderBottom: "2px solid var(--content-emphasis)"
        }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "var(--matty-black)"
      }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ 
            fontSize: "1.25rem", 
            fontWeight: "700", 
            color: "var(--content-error)", 
            marginBottom: "0.5rem",
            margin: 0
          }}>
            Connection Error
          </h2>
          <p style={{ color: "var(--content-muted)", margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "var(--matty-black)",
      color: "var(--content-emphasis)"
    }}>
      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        {storeMessages.map((chat, index) => (
          <Card key={chat.id || index} variant="glass" style={{ padding: "1rem" }}>
            {chat.user && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem", 
                marginBottom: "0.5rem" 
              }}>
                <Avatar name={chat.user.name} size="sm" />
                <span style={{ 
                  fontWeight: "600", 
                  fontSize: "0.875rem", 
                  color: "var(--content-emphasis)" 
                }}>
                  {chat.user.name}
                </span>
                {chat.createdAt && (
                  <span style={{ 
                    fontSize: "0.75rem", 
                    color: "var(--content-muted)" 
                  }}>
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
            <p style={{ color: "var(--content-muted)", margin: 0 }}>{chat.message}</p>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div style={{
        borderTop: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-emphasis)",
        padding: "1rem",
      }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{ flex: 1 }}
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