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
                message: parsedData.message,
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
    if (!currentMessage.trim() || !socket) return;

    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: id,
        message: currentMessage.trim(),
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Connection Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats.map((chat, index) => (
          <div
            key={chat.id || index}
            className="bg-white rounded-lg p-4 shadow"
          >
            {chat.user && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {chat.user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-sm">{chat.user.name}</span>
                {chat.createdAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
            <p className="text-gray-800">{chat.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!socket}
          />
          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || !socket}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}