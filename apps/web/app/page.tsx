"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../components/TopBar";

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
    } catch (err: any) {
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
            <div className="flex items-center justify-center inline-block mb-4 relative">
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
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
            
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
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
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
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
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
                    <button
                      onClick={handleJoinRoom}
                      className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 text-sm"
                    >
                      Join Room
                    </button>
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
                  <button
                    key={room}
                    onClick={() => handleQuickJoin(room)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 rounded-lg text-sm font-medium text-gray-200 hover:text-white transition-all duration-200 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    #{room}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isSignUp ? "Create Account" : "Sign In"}
              </h2>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setError("");
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400/50 outline-none transition-all text-white placeholder-gray-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400/50 outline-none transition-all text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400/50 outline-none transition-all text-white placeholder-gray-400"
                />
              </div>

              <button
                onClick={handleAuth}
                disabled={isAuthenticating}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                {isAuthenticating ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")}
              </button>

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
          </div>
        </div>
      )}
    </div>
  );
}