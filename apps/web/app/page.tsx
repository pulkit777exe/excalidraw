"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, Modal } from "@repo/ui";
import TopBar from "../components/TopBar";
import { Mail, Lock, User, Plus, LogIn } from "lucide-react";

function generateRoomId(): string {
  const adjectives = ["swift", "cosmic", "bright", "quiet", "bold", "cool", "warm", "vivid"];
  const nouns = ["tiger", "eagle", "river", "mountain", "ocean", "forest", "storm", "star"];
  const randomNum = Math.floor(Math.random() * 1000);
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adj}-${noun}-${randomNum}`;
}

export default function Home() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customRoomId, setCustomRoomId] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3008";

  const handleAuth = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = userName.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required");
      return;
    }

    if (isSignUp && !trimmedName) {
      setError("Name is required for sign up");
      return;
    }

    setIsAuthenticating(true);
    setError("");

    try {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/signin";
      const body = isSignUp 
        ? { name: trimmedName, email: trimmedEmail, password: trimmedPassword }
        : { email: trimmedEmail, password: trimmedPassword };

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("userName", isSignUp ? trimmedName : data.user?.name || trimmedEmail);
      
      setShowAuthModal(false);
      setError("");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCreateRoom = () => {
    const token = sessionStorage.getItem("authToken");
    const storedName = sessionStorage.getItem("userName");
    
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    const roomId = generateRoomId();
    router.push(`/room/${roomId}?token=${token}&name=${encodeURIComponent(storedName || "User")}`);
  };

  const handleJoinRoom = () => {
    const token = sessionStorage.getItem("authToken");
    const storedName = sessionStorage.getItem("userName");
    const roomId = customRoomId.trim().toLowerCase();
    
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    if (!roomId) {
      setError("Please enter a room ID");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(roomId)) {
      setError("Room ID can only contain lowercase letters, numbers, and hyphens");
      return;
    }

    router.push(`/room/${roomId}?token=${token}&name=${encodeURIComponent(storedName || "User")}`);
  };

  const handleQuickJoin = (room: string) => {
    const token = sessionStorage.getItem("authToken");
    const storedName = sessionStorage.getItem("userName");
    
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    router.push(`/room/${room}?token=${token}&name=${encodeURIComponent(storedName || "User")}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <TopBar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-3rem)] p-4 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 relative">
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 tracking-tight relative z-10">
                Escalidraw
              </h1>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-2xl -z-10"></div>
            </div>
            <p className="text-lg text-gray-300 font-light">
              Real-time collaborative drawing and chat
            </p>
          </div>

          {/* Main Card */}
          <Card variant="glass" className="p-6 md:p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-red-200 font-medium">{error}</p>
              </div>
            )}

            {/* Two Options */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Create New Room */}
              <button
                onClick={handleCreateRoom}
                className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-2 border-blue-400/20 rounded-2xl p-5 hover:border-blue-400/50 hover:from-blue-500/20 hover:to-blue-600/10 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Create New Room
                    </h3>
                    <p className="text-sm text-gray-300">
                      Start fresh with a random room ID
                    </p>
                  </div>
                </div>
              </button>

              {/* Join Existing Room */}
              <div className="group bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-2 border-emerald-400/20 rounded-2xl p-5 hover:border-emerald-400/50 hover:from-emerald-500/20 hover:to-emerald-600/10 transition-all duration-300">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <LogIn className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      Join Existing Room
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Enter a room ID to collaborate
                    </p>
                    <input
                      type="text"
                      value={customRoomId}
                      onChange={(e) => {
                        setCustomRoomId(e.target.value);
                        setError("");
                      }}
                      placeholder="e.g., swift-tiger-123"
                      className="w-full px-3 py-2 mb-2 bg-white/5 border-2 border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400/50 outline-none transition-all text-white text-sm placeholder-gray-400 backdrop-blur-sm hover:bg-white/10"
                    />
                    <Button
                      onClick={handleJoinRoom}
                      variant="success"
                      size="sm"
                      className="w-full"
                    >
                      Join Room
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Join Section */}
            <div className="pt-6 border-t-2 border-white/10">
              <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                Popular Rooms
              </h4>
              <div className="flex flex-wrap gap-2">
                {["general", "design", "brainstorm", "random"].map((room) => (
                  <Button
                    key={room}
                    onClick={() => handleQuickJoin(room)}
                    variant="ghost"
                    size="sm"
                    className="border border-white/10 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    #{room}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Rooms are created automatically • All sessions are collaborative
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="mt-3 text-sm text-purple-300 hover:text-purple-200 underline"
            >
              {sessionStorage.getItem("authToken") ? "Switch Account" : "Sign In / Sign Up"}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setError("");
        }}
        title={isSignUp ? "Create Account" : "Sign In"}
      >
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {isSignUp && (
            <Input
              type="text"
              label="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              icon={<User className="w-5 h-5" />}
            />
          )}

          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            icon={<Mail className="w-5 h-5" />}
          />

          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={<Lock className="w-5 h-5" />}
          />

          <Button
            onClick={handleAuth}
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isAuthenticating}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <div className="text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-sm text-purple-300 hover:text-purple-200"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}