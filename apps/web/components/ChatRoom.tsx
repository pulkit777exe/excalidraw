"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ChatRoomClient } from "./ChatRoomClient";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3008";

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

export default function ChatRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<{
    messages: Message[];
    token: string;
    id: string;
    userName: string;
  } | null>(null);

  const slug = params?.slug as string;
  const token = searchParams?.get("token");
  const userName = searchParams?.get("name") || "Anonymous";

  useEffect(() => {
    if (!slug) return;

    if (!token) {
      router.push("/");
      return;
    }

    const initializeRoom = async () => {
      try {
        const roomRes = await axios.get(`${BACKEND_URL}/api/room/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!roomRes.status || roomRes.status !== 200) {
          setError(roomRes.status === 404 ? "Room not found" : "Failed to load room");
          setIsLoading(false);
          return;
        }

        const roomJson = roomRes.data;
        const roomIdNum: number | undefined = roomJson?.data?.room?.id;
        if (!roomIdNum) {
          setError("Invalid room response");
          setIsLoading(false);
          return;
        }

        const chatsRes = await axios.get(`${BACKEND_URL}/api/chats/${roomIdNum}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let messages: Message[] = [];
        if (chatsRes.status === 200) {
          const chatsJson = chatsRes.data;
          const rawMessages = chatsJson?.data?.messages || [];
          messages = rawMessages.map((msg: { id?: string; message: string; createdAt: string; userId?: string; user?: { id: string; name: string; email: string } }) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
            id: msg.id || Math.random().toString(36).substr(2, 9),
            userId: msg.userId || msg.user?.id || "unknown"
          }));
        }

        setRoomData({ messages, token, id: String(roomIdNum), userName });
        setIsLoading(false);
      } catch (err) {
        console.error("Room initialization error:", err);
        setError("Failed to connect to the room");
        setIsLoading(false);
      }
    };

    initializeRoom();
  }, [slug, token, router, userName]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, var(--matty-black) 0%, var(--matty-brown) 50%, var(--matty-blue) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            width: "4rem",
            height: "4rem",
            border: "4px solid var(--matty-blue)",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1rem"
          }}></div>
          <p style={{ color: "var(--content-emphasis)", fontSize: "1.125rem", margin: 0 }}>Connecting to room...</p>
          <p style={{ color: "var(--content-muted)", fontSize: "0.875rem", marginTop: "0.5rem", margin: 0 }}>{slug}</p>
        </div>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, var(--matty-black) 0%, var(--matty-brown) 50%, var(--matty-blue) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}>
        <div style={{
          backgroundColor: "rgba(211, 47, 47, 0.2)",
          border: "1px solid rgba(211, 47, 47, 0.3)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          maxWidth: "28rem"
        }}>
          <h2 style={{ 
            fontSize: "1.25rem", 
            fontWeight: "700", 
            color: "var(--content-error)", 
            marginBottom: "0.5rem",
            margin: 0
          }}>
            Connection Failed
          </h2>
          <p style={{ 
            color: "var(--content-error)", 
            fontWeight: "500", 
            marginBottom: "1rem",
            margin: 0
          }}>
            {error || "Failed to load room"}
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              width: "100%",
              padding: "0.5rem 1.5rem",
              backgroundColor: "var(--content-error)",
              color: "var(--content-inverted)",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              fontWeight: "600"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--content-error)";
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--content-error)";
              e.currentTarget.style.opacity = "1";
            }}
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
      id={roomData.id}
      token={roomData.token}
      userName={roomData.userName}
    />
  );
}