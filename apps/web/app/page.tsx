"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Button, 
  Input, 
  Card, 
  Modal, 
  Section, 
  SectionContainer, 
  SectionHeader, 
  SectionTitle, 
  SectionDescription,
  Layout,
  FeatureCard,
  Background
} from "@repo/ui";
import { useAuthStore, useUIStore } from "@repo/store";
import TopBar from "../components/TopBar";
import { Mail, Lock, User, Plus, LogIn } from "lucide-react";

function generateRoomId(): string {
  const adjectives = [
    "swift",
    "cosmic",
    "bright",
    "quiet",
    "bold",
    "cool",
    "warm",
    "vivid",
  ];
  const nouns = [
    "tiger",
    "eagle",
    "river",
    "mountain",
    "ocean",
    "forest",
    "storm",
    "star",
  ];
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
  const router = useRouter();

  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading, 
    error: authError, 
    login, 
    setLoading, 
    setError, 
    clearError 
  } = useAuthStore();

  const { 
    showAuthModal, 
    isSignUp, 
    error: uiError, 
    setShowAuthModal, 
    setIsSignUp
  } = useUIStore();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3008";
  const error = authError || uiError;

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

    setLoading(true);
    clearError();

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

      login(data.user, data.token);
      setShowAuthModal(false);
      clearError();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const roomId = generateRoomId();
    router.push(
      `/room/${roomId}?token=${user?.id}&name=${encodeURIComponent(user?.name || "User")}`
    );
  };

  const handleJoinRoom = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const roomId = customRoomId.trim().toLowerCase();

    if (!roomId) {
      setError("Please enter a room ID");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(roomId)) {
      setError(
        "Room ID can only contain lowercase letters, numbers, and hyphens"
      );
      return;
    }

    router.push(
      `/room/${roomId}?token=${user?.id}&name=${encodeURIComponent(user?.name || "User")}`
    );
  };

  const handleQuickJoin = (room: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    router.push(
      `/room/${room}?token=${user?.id}&name=${encodeURIComponent(user?.name || "User")}`
    );
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    clearError();
  };

  const handleToggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
  };

  return (
    <Background variant="animated">
      <TopBar />

      <Section variant="hero" background="default">
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Escalidraw</SectionTitle>
            <SectionDescription>
              Real-time collaborative drawing and chat
            </SectionDescription>
          </SectionHeader>

          <Layout variant="centered">
            <Card variant="glass" className="w-full max-w-2xl">
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                  <p className="text-sm text-red-200 font-medium">{error}</p>
                </div>
              )}

              <Layout variant="default" spacing="lg">
                <FeatureCard
                  icon={<Plus />}
                  title="Create New Room"
                  description="Start fresh with a random room ID"
                  onClick={handleCreateRoom}
                  className="cursor-pointer"
                />

                <Layout variant="default" spacing="md">
                  <FeatureCard
                    icon={<LogIn />}
                    title="Join Existing Room"
                    description="Enter a room ID to collaborate"
                    variant="glass"
                  >
                    <Layout variant="default" spacing="sm">
                      <input
                        type="text"
                        value={customRoomId}
                        onChange={(e) => {
                          setCustomRoomId(e.target.value);
                          clearError();
                        }}
                        placeholder="e.g., swift-tiger-123"
                        className="w-full px-3 py-2 mb-2 bg-white/5 border-2 border-white/10 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-white/40 outline-none transition-all text-white text-sm placeholder-gray-400 backdrop-blur-sm hover:bg-white/10"
                      />
                      <Button
                        onClick={handleJoinRoom}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        Join Room
                      </Button>
                    </Layout>
                  </FeatureCard>
                </Layout>

                <Layout variant="default" spacing="sm">
                  <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 bg-zinc-300 rounded-full animate-pulse"></span>
                    Popular Rooms
                  </h4>
                  <Layout variant="default" spacing="sm">
                    {["general", "design", "brainstorm", "random"].map((room) => (
                      <Button
                        key={room}
                        onClick={() => handleQuickJoin(room)}
                        variant="ghost"
                        size="sm"
                        className="border border-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-black/20"
                      >
                        #{room}
                      </Button>
                    ))}
                  </Layout>
                </Layout>
              </Layout>
            </Card>

            <Layout variant="default" spacing="sm">
              <p className="text-sm text-zinc-400 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-pulse"></span>
                Rooms are created automatically • All sessions are collaborative
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm text-zinc-200 hover:text-zinc-100 underline"
              >
                {isAuthenticated ? "Switch Account" : "Sign In / Sign Up"}
              </button>
            </Layout>
          </Layout>
        </SectionContainer>
      </Section>

      <Modal
        isOpen={showAuthModal}
        onClose={handleCloseModal}
        title={isSignUp ? "Create Account" : "Sign In"}
      >
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-400/30 rounded-xl">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <Layout variant="default" spacing="md">
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
            isLoading={authLoading}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <div className="text-center">
            <button
              onClick={handleToggleAuthMode}
              className="text-sm text-zinc-200 hover:text-zinc-100"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </Layout>
      </Modal>
    </Background>
  );
}