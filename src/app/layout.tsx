import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Burst - AI Authority Content Platform",
  description: "Generate authority-leveraged articles for LinkedIn, Medium, and other high-trust platforms. Build your personal brand with AI-powered content.",
  keywords: ["AI content", "LinkedIn articles", "authority building", "content marketing", "thought leadership"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
