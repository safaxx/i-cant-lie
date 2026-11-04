import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toast";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: "icl",
  title: "icl | tell me anything, anonymously.",
  description: "tell me anything, anonymously. send a message here!",
  openGraph: {
    type: "website",
    siteName: "icl",
    title: "icl | tell me anything, anonymously.",
    description: "tell me anything, anonymously. send a message here!",
    images: [
      {
        url: "/icl-share-card.png",
        width: 1200,
        height: 630,
        alt: "icl — tell me anything, anonymously. send a message here!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "icl | tell me anything, anonymously.",
    description: "tell me anything, anonymously. send a message here!",
    images: ["/icl-share-card.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <AuthProvider>
        <body className="min-h-full flex flex-col">
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
