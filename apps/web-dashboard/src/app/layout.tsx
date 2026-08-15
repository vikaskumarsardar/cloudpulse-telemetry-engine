import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudPulse | Microservices Telemetry Dashboard",
  description: "Real-Time Observability and Performance Dashboard built with Next.js 14, Shadcn UI, and Recharts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
