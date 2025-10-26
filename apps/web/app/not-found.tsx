"use client";

import { useRouter } from "next/navigation";
import { 
  Button, 
  Card, 
  Section, 
  SectionContainer, 
  SectionHeader, 
  SectionTitle, 
  SectionDescription,
  Layout,
  Background
} from "@repo/ui";
import NavBar from "../components/layout/NavBar";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-default)" }}>
      <Background variant="animated">
        <NavBar />

        <Section variant="hero" background="default">
          <SectionContainer>
            <SectionHeader>
              <div style={{ 
                fontSize: "6rem", 
                fontWeight: "700", 
                background: "linear-gradient(135deg, var(--matty-blue) 0%, var(--accent-purple) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
                textAlign: "center"
              }}>
                404
              </div>
              <SectionTitle>Page Not Found</SectionTitle>
              <SectionDescription>
                Oops! The page you're looking for doesn't exist or has been moved.
              </SectionDescription>
            </SectionHeader>

            <Layout variant="centered">
              <Card variant="glass" style={{ width: "100%", maxWidth: "32rem" }}>
                <Layout variant="default" spacing="md">
                  <div style={{
                    padding: "2rem",
                    textAlign: "center",
                    borderRadius: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                  }}>
                    <Search 
                      style={{ 
                        width: "4rem", 
                        height: "4rem", 
                        margin: "0 auto 1rem",
                        color: "var(--content-muted)",
                        opacity: 0.5
                      }} 
                    />
                    <p style={{ 
                      fontSize: "0.875rem", 
                      color: "var(--content-muted)",
                      margin: 0,
                      lineHeight: "1.6"
                    }}>
                      The room or page you're trying to access might have been deleted,
                      or the URL might be incorrect.
                    </p>
                  </div>

                  <Layout variant="default" spacing="sm">
                    <Button
                      onClick={() => router.push("/")}
                      variant="primary"
                      size="lg"
                      style={{ width: "100%" }}
                    >
                      <Home style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.5rem" }} />
                      Go to Home
                    </Button>

                    <Button
                      onClick={() => router.back()}
                      variant="secondary"
                      size="lg"
                      style={{ width: "100%" }}
                    >
                      <ArrowLeft style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.5rem" }} />
                      Go Back
                    </Button>
                  </Layout>

                  <div style={{ 
                    textAlign: "center",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                  }}>
                    <p style={{ 
                      fontSize: "0.875rem", 
                      color: "var(--content-muted)",
                      margin: "0 0 0.5rem 0"
                    }}>
                      Need help?
                    </p>
                    <button
                      onClick={() => router.push("/")}
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--matty-blue)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                        transition: "color 0.2s ease",
                        fontWeight: "500"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--accent-purple)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--matty-blue)";
                      }}
                    >
                      Create a new room instead
                    </button>
                  </div>
                </Layout>
              </Card>

              <Layout variant="default" spacing="sm">
                <p style={{ 
                  fontSize: "0.875rem", 
                  color: "var(--content-muted)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "0.5rem",
                  margin: 0
                }}>
                  <span style={{ 
                    width: "0.375rem", 
                    height: "0.375rem", 
                    backgroundColor: "var(--matty-blue)", 
                    borderRadius: "50%", 
                    animation: "pulse 2s infinite" 
                  }}></span>
                  Lost? Return to the homepage to start collaborating
                </p>
              </Layout>
            </Layout>
          </SectionContainer>
        </Section>
      </Background>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}