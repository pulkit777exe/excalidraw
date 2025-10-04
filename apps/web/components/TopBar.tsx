"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Home, LogOut } from "lucide-react";

interface TopBarProps {
  children?: React.ReactNode;
}

export default function TopBar({ children }: TopBarProps) {
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
    <div className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <button 
          onClick={handleHome}
          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:scale-105 transition-transform"
        >
          Escalidraw
        </button>
        {children}
      </div>
      
      <div className="flex items-center gap-3">
        {isAuthenticated && userName && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300 hidden md:block">
              Welcome, <span className="text-white font-semibold">{userName}</span>
            </span>
            <Button
              onClick={handleHome}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Home</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}