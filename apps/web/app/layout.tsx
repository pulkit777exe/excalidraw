import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "Sprat - Collaborative Drawing",
  description: "Real-time collaborative drawing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="dark">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
