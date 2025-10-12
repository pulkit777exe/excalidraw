"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Home, LogOut } from "lucide-react";

interface NavBarProps {
  children?: React.ReactNode;
}

export default function NavBar({ children }: NavBarProps) {
  const router = useRouter();
  const userName = typeof window !== "undefined" ? sessionStorage.getItem("userName") : null;
  const isAuthenticated = typeof window !== "undefined" ? !!sessionStorage.getItem("authToken") : false;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userName");
      router.push("/");
    }
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div style={{
      backgroundColor: "rgba(32, 30, 31, 0.8)",
      backdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "0.75rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button 
          onClick={handleHome}
          style={{
            fontSize: "1.5rem",
            fontWeight: "900",
            background: "linear-gradient(135deg, var(--matty-blue) 0%, var(--matty-skin) 50%, var(--matty-brown) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Sprat
        </button>
        {children}
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {isAuthenticated && userName && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ 
              fontSize: "0.875rem", 
              color: "var(--content-muted)",
              display: "none"
            }}>
              Welcome, <span style={{ color: "var(--content-emphasis)", fontWeight: "600" }}>{userName}</span>
            </span>
            <Button
              onClick={handleHome}
              variant="ghost"
              size="sm"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Home style={{ width: "1rem", height: "1rem" }} />
              <span style={{ display: "none" }}>Home</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <LogOut style={{ width: "1rem", height: "1rem" }} />
              <span style={{ display: "none" }}>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}