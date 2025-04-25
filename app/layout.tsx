import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../providers/auth-provider";
import { DatabaseProvider } from "../providers/database-provider";
import { KeyProvider } from '../providers/key-provider';
import AppLayout from "@/components/AppLayout";
import { NewConversationProvider } from "../providers/new-conversation-provider";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ModalProvider } from "@/providers/modal-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ground 0",
  description: "Ground 0 is an open source chat interface for large language models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-sage-1`}
      >
        
          <PostHogProvider>
            <DatabaseProvider>
            <KeyProvider>
              <NewConversationProvider>
                <AuthProvider>
                  <AppLayout>
                  <ModalProvider>
                    {children}
                  </ModalProvider>
                  </AppLayout>
                </AuthProvider>
              </NewConversationProvider>
            </KeyProvider>
            </DatabaseProvider>
          </PostHogProvider>
      </body>
    </html>
  );
}
