import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { AnimatedBackground } from "@/components/animated-background";

export const metadata: Metadata = {
  title: "Mix Aura | Marketing & Development",
  description: "A marketing agency and development team dedicated to building brands that make an impact. Start like a pro.",
  openGraph: {
    title: "Mix Aura | Marketing & Development",
    description: "A marketing agency and development team dedicated to building brands that make an impact. Start like a pro.",
    siteName: 'Mix Aura',
    images: [
      {
        url: 'https://picsum.photos/seed/mixaura/1200/630',
        width: 1200,
        height: 630,
        alt: 'Mix Aura Digital Agency',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mix Aura | Marketing & Development",
    description: "A marketing agency and development team dedicated to building brands that make an impact. Start like a pro.",
    images: ['https://picsum.photos/seed/mixaura/1200/630'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AnimatedBackground />
          <div className="relative">
            {children}
          </div>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
