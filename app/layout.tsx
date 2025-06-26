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
import { ThemeProvider } from "../providers/theme-provider";
import AppContainer from "@/components/AppContainer";
import { AnimatePresence } from "framer-motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chaterface",
  description: "Chaterface is an open source chat interface for large language models.",
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
                <AuthProvider>
                  <DatabaseProvider>
                  <KeyProvider>
                  <NewConversationProvider>
                <ThemeProvider>
                <ModalProvider>
                    <AppContainer>
                      <AnimatePresence mode="wait">{children}</AnimatePresence>
                    </AppContainer>
                </ModalProvider>
                </ThemeProvider>
                </NewConversationProvider>
              </KeyProvider>
            </DatabaseProvider>
          </AuthProvider>
          </PostHogProvider>
      </body>
    </html>
  );
}
