"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatRoom from "../../../components/ChatRoom";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3008";

export default function RoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/signin");
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/room/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Room not found");
          } else {
            setError("Failed to load room");
          }
          return;
        }

        const data = await response.json();
        setRoomId(data.data.room.id);
      } catch (err) {
        setError("An error occurred while loading the room");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [slug, router]);

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
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!roomId) return null;

  return <ChatRoom id={roomId} />;
}