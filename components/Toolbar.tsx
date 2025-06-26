import { db } from "@/lib/instant-admin";
import { useAuth } from "@/providers/auth-provider";
import { Plus, SidebarSimple, SignIn, SignOut } from "@phosphor-icons/react";
import Link from "next/link";
import { useSidebarStore } from "./Sidebar";
import { useDatabase } from "@/providers/database-provider";


export default function Toolbar({ className }: { className?: string }) {
  const { user } = useAuth();
  const { db } = useDatabase();
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();

  const url = db.auth.createAuthorizationURL({
    clientName: "google-web",
    redirectURL: window.location.href,
  });


  const signOut = () => {
    db.auth.signOut();
  };
  return (
    <div className={`flex flex-row gap-1 bg-gray-2 dark:bg-gray-3 rounded-md p-px items-center ${className}`}>
      {user ? (
        <button onClick={() => signOut()} className="p-1 hover:bg-gray-2 dark:hover:bg-gray-3 rounded-md group transition-colors duration-300">
          <SignOut size={14} weight="bold" className="text-gray-10 group-hover:text-gray-12 dark:text-gray-9 dark:group-hover:text-gray-11 transition-colors duration-300" />
        </button>
      ) : (
        <Link href={url} className="p-1 hover:bg-gray-2 dark:hover:bg-gray-3 rounded-md group transition-colors duration-300">
          <SignIn size={14} weight="bold" className="text-gray-10 group-hover:text-gray-12 dark:text-gray-9 dark:group-hover:text-gray-11 transition-colors duration-300" />
        </Link>
      )}

      <Link href="/" className="p-1 hover:bg-gray-2 dark:hover:bg-gray-3 rounded-md group transition-colors duration-300">
        <Plus size={14} weight="bold" className="text-gray-10 group-hover:text-gray-12 dark:text-gray-9 dark:group-hover:text-gray-11 transition-colors duration-300" />
      </Link>

      <button className="p-1 hover:bg-gray-2 dark:hover:bg-gray-3 rounded-md group transition-colors duration-300" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <SidebarSimple size={14} weight="bold" className="text-gray-10 group-hover:text-gray-12 dark:text-gray-9 dark:group-hover:text-gray-11 transition-colors duration-300" />
      </button>
      
    </div>
  );
}