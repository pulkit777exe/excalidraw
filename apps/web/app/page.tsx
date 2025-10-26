"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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
  Background,
} from "@repo/ui";
import { useAuthStore, useUIStore } from "@repo/store";
import NavBar from "../components/layout/NavBar";
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
    clearError,
  } = useAuthStore();

  const {
    showAuthModal,
    isSignUp,
    error: uiError,
    setShowAuthModal,
    setIsSignUp,
  } = useUIStore();

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3008";
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

      const response = await axios.post(`${BACKEND_URL}${endpoint}`, body);

      console.log("Full response:", response.data);

      const responseData = response.data.data || response.data;

      if (!responseData.user || !responseData.token) {
        throw new Error("Invalid response from server");
      }

      login(responseData.user, responseData.token);
      setShowAuthModal(false);
      clearError();

      setEmail("");
      setPassword("");
      setUserName("");
    } catch (err: any) {
      console.error("Auth error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
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

    const canvasId = generateRoomId();
    router.push(
      `/canvas/${canvasId}?token=${user?.id}&name=${encodeURIComponent(user?.name || "User")}`
    );
  };

  const handleJoinRoom = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const canvasId = customRoomId.trim().toLowerCase();

    if (!canvasId) {
      setError("Please enter a canvas ID");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(canvasId)) {
      setError(
        "Canvas ID can only contain lowercase letters, numbers, and hyphens"
      );
      return;
    }

    router.push(
      `/canvas/${canvasId}?token=${user?.id}&name=${encodeURIComponent(user?.name || "User")}`
    );
  };

  const handleQuickJoin = (canvasId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    router.push(
      `/canvas/${canvasId}?token=${user?.id}&name=${encodeURIComponent(user?.name || "User")}`
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAuth();
    }
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
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-default)" }}
    >
      <Background variant="animated">
        <NavBar />

        <Section variant="hero" background="default">
          <SectionContainer>
            <SectionHeader>
              <SectionTitle>Sprat</SectionTitle>
              <SectionDescription>
                Real-time collaborative drawing and chat
              </SectionDescription>
            </SectionHeader>

            <Layout variant="centered">
              <Card
                variant="glass"
                style={{ width: "100%", maxWidth: "32rem" }}
              >
                {error && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "0.75rem",
                      backgroundColor: "rgba(211, 47, 47, 0.2)",
                      border: "1px solid rgba(211, 47, 47, 0.3)",
                      borderRadius: "0.75rem",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--content-error)",
                        fontWeight: "500",
                        margin: 0,
                      }}
                    >
                      {error}
                    </p>
                  </div>
                )}

                <Layout variant="default" spacing="lg">
                  <FeatureCard
                    icon={<Plus />}
                    title="Create New Room"
                    description="Start fresh with a random room ID"
                    onClick={handleCreateRoom}
                    style={{ cursor: "pointer" }}
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
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            marginBottom: "0.5rem",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "2px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "0.5rem",
                            outline: "none",
                            transition: "all 0.3s ease",
                            color: "var(--content-emphasis)",
                            fontSize: "0.875rem",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor =
                              "rgba(255, 255, 255, 0.4)";
                            e.target.style.backgroundColor =
                              "rgba(255, 255, 255, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor =
                              "rgba(255, 255, 255, 0.1)";
                            e.target.style.backgroundColor =
                              "rgba(255, 255, 255, 0.05)";
                          }}
                        />
                        <Button
                          onClick={handleJoinRoom}
                          variant="secondary"
                          size="sm"
                          style={{ width: "100%" }}
                        >
                          Join Room
                        </Button>
                      </Layout>
                    </FeatureCard>
                  </Layout>

                  <Layout variant="default" spacing="sm">
                    <h4
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "var(--content-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        margin: 0,
                      }}
                    >
                      <span
                        style={{
                          width: "0.5rem",
                          height: "0.5rem",
                          backgroundColor: "var(--matty-blue)",
                          borderRadius: "50%",
                          animation: "pulse 2s infinite",
                        }}
                      ></span>
                      Popular Rooms
                    </h4>
                    <Layout variant="default" spacing="sm">
                      {["general", "design", "brainstorm", "random"].map(
                        (room) => (
                          <Button
                            key={room}
                            onClick={() => handleQuickJoin(room)}
                            variant="ghost"
                            size="sm"
                            style={{
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor =
                                "rgba(255, 255, 255, 0.3)";
                              e.currentTarget.style.boxShadow =
                                "0 10px 15px -3px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor =
                                "rgba(255, 255, 255, 0.1)";
                              e.currentTarget.style.boxShadow = "";
                            }}
                          >
                            #{room}
                          </Button>
                        )
                      )}
                    </Layout>
                  </Layout>
                </Layout>
              </Card>

              <Layout variant="default" spacing="sm">
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--content-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    margin: 0,
                  }}
                >
                  <span
                    style={{
                      width: "0.375rem",
                      height: "0.375rem",
                      backgroundColor: "var(--matty-blue)",
                      borderRadius: "50%",
                      animation: "pulse 2s infinite",
                    }}
                  ></span>
                  Rooms are created automatically • All sessions are
                  collaborative
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--content-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--content-emphasis)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--content-muted)";
                  }}
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
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                backgroundColor: "rgba(211, 47, 47, 0.1)",
                border: "1px solid rgba(211, 47, 47, 0.3)",
                borderRadius: "0.75rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--content-error)",
                  margin: 0,
                }}
              >
                {error}
              </p>
            </div>
          )}

          <Layout variant="default" spacing="md">
            {isSignUp && (
              <Input
                type="text"
                label="Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your name"
                icon={<User style={{ width: "1.25rem", height: "1.25rem" }} />}
              />
            )}

            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your email"
              icon={<Mail style={{ width: "1.25rem", height: "1.25rem" }} />}
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your password"
              icon={<Lock style={{ width: "1.25rem", height: "1.25rem" }} />}
            />

            <Button
              onClick={handleAuth}
              variant="primary"
              size="lg"
              style={{ width: "100%" }}
              isLoading={authLoading}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleToggleAuthMode}
                style={{
                  fontSize: "0.875rem",
                  color: "var(--content-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--content-emphasis)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--content-muted)";
                }}
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </Layout>
        </Modal>
      </Background>
    </div>
  );
}
