"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ChatRoomClient } from "./ChatRoomClient";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3008";

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

export default function ChatRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<{
    messages: Message[];
    token: string;
  } | null>(null);

  const roomId = params?.roomId as string;
  const token = searchParams?.get("token");
  const userName = searchParams?.get("name");

  useEffect(() => {
    // Redirect if no token provided
    if (!token) {
      router.push("/");
      return;
    }

    // Initialize room: fetch messages
    const initializeRoom = async () => {
      try {
        // Fetch room messages
        const messagesResponse = await fetch(`${BACKEND_URL}/api/room/${roomId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        let messages: Message[] = [];
        if (messagesResponse.ok) {
          const data = await messagesResponse.json();
          messages = data.chats || [];
        }

        setRoomData({
          messages,
          token,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Room initialization error:", err);
        setError("Failed to connect to the room");
        setIsLoading(false);
      }
    };

    initializeRoom();
  }, [roomId, token, router]);

  if (!userName) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Connecting to room...</p>
          <p className="text-gray-400 text-sm mt-2">{roomId}</p>
        </div>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-200 mb-2">Connection Failed</h2>
          <p className="text-red-200 font-medium mb-4">{error || "Failed to load room"}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatRoomClient
      messages={roomData.messages}
      id={roomId}
      token={roomData.token}
    />
  );
}