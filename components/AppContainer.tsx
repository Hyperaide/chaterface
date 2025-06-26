"use client";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import Sidebar from "@/components/Sidebar";
import IntroductionModal from "@/components/IntroductionModal";

export default function AppContainer({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`flex flex-row bg-gray-1 h-dvh ${theme === 'dark' ? 'dark' : ''}`}>
    {!user && (
      <IntroductionModal />
    )}
    <Sidebar />
    <div className="flex-1 bg-gray-1 relative border-gray-4 rounded-xl">
      {children}
    </div>
    </div>
  );
}