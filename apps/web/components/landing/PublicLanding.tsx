"use client";

import {
  Button,
  Card,
  CardContent,
  Section,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  Layout,
  FeatureCard,
  Background,
} from "@repo/ui";
import NavBar from "../layout/NavBar";
import {
  Plus, 
  LogIn, 
  ArrowRight,
  Palette,
  MessageSquare,
  Zap,
  Sparkles
} from "lucide-react";

interface PublicLandingProps {
  onShowAuthModal: () => void;
}

export default function PublicLanding({ onShowAuthModal }: PublicLandingProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-default)" }}>
      <Background variant="animated">
        <NavBar />
        
        <Section variant="hero" background="default">
          <SectionContainer>
            <SectionHeader>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1.25rem",
                background: "rgba(107, 122, 137, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(107, 122, 137, 0.3)",
                borderRadius: "2rem",
                marginBottom: "2rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "var(--matty-blue)",
              }}>
                <Sparkles style={{ width: "1rem", height: "1rem" }} />
                Real-time Collaboration
              </div>
              
              <SectionTitle>Draw, Chat, Create Together</SectionTitle>
              <SectionDescription>
                Collaborative drawing canvas with real-time chat. Join rooms instantly and create together.
              </SectionDescription>
            </SectionHeader>

            <Layout variant="centered">
              <Card variant="glass" style={{ width: "100%", maxWidth: "32rem" }}>
                <CardContent style={{ padding: "2rem" }}>
                  <Layout variant="default" spacing="lg">
                    <FeatureCard
                      icon={<Plus style={{ width: "1.5rem", height: "1.5rem", color: "var(--content-inverted)" }} />}
                      title="Create New Room"
                      description="Start fresh with a random room ID"
                      onClick={onShowAuthModal}
                    />

                    <FeatureCard
                      icon={<LogIn style={{ width: "1.5rem", height: "1.5rem", color: "var(--content-inverted)" }} />}
                      title="Join Existing Room"
                      description="Have a room ID? Jump right in"
                      onClick={onShowAuthModal}
                    />

                    <div style={{ textAlign: "center", paddingTop: "1rem" }}>
                      <Button
                        onClick={onShowAuthModal}
                        variant="primary"
                        size="lg"
                        style={{ width: "100%" }}
                      >
                        Get Started <ArrowRight style={{ width: "1.25rem", height: "1.25rem", marginLeft: "0.5rem" }} />
                      </Button>
                    </div>
                  </Layout>
                </CardContent>
              </Card>

              {/* Feature Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginTop: "4rem",
                maxWidth: "900px",
              }}>
                <FeatureCard
                  icon={<Palette style={{ width: "1.5rem", height: "1.5rem", color: "var(--content-inverted)" }} />}
                  title="Draw Together"
                  description="Real-time collaborative canvas with multiple tools"
                  hover={false}
                  variant="glass"
                />
                <FeatureCard
                  icon={<MessageSquare style={{ width: "1.5rem", height: "1.5rem", color: "var(--content-inverted)" }} />}
                  title="Team Chat"
                  description="Communicate while you create with built-in chat"
                  hover={false}
                  variant="glass"
                />
                <FeatureCard
                  icon={<Zap style={{ width: "1.5rem", height: "1.5rem", color: "var(--content-inverted)" }} />}
                  title="Instant Rooms"
                  description="No setup required, start collaborating immediately"
                  hover={false}
                  variant="glass"
                />
              </div>
            </Layout>
          </SectionContainer>
        </Section>
      </Background>
    </div>
  );
}
