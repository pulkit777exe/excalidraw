import { useEffect, useState, useRef } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export function useSocket(token?: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined); // Fixed

  useEffect(() => {
    if (!token) {
      setError("Authentication token not found");
      setLoading(false);
      return;
    }

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
          console.log("WebSocket connected");
          setLoading(false);
          setError(null);
          setSocket(ws);
        };

        ws.onerror = (event) => {
          console.error("WebSocket error:", event);
          setError("Failed to connect to chat server");
          setLoading(false);
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          setSocket(null);
          
          // Attempt reconnection after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connectWebSocket();
          }, 3000);
        };

        return ws;
      } catch (err) {
        console.error("Error creating WebSocket:", err);
        setError("Failed to create WebSocket connection");
        setLoading(false);
        return null;
      }
    };

    const ws = connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [token]);

  return { socket, loading, error };
}