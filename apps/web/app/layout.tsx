import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EscaliDraw - Collaborative Drawing",
  description: "Real-time collaborative drawing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
