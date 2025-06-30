"use client"
import { useDatabase } from "@/providers/database-provider";
import { DateTime } from "luxon";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Chat, CreditCard, DiamondsFour, Gear, MoonStars, Plus, SidebarSimple, SignIn, SignOut, Sun, Users } from "@phosphor-icons/react";
import NumberFlow from "@number-flow/react";
import { useAuth } from "@/providers/auth-provider";
import { useEffect, useState } from "react";
import PlansModal from "./modals/PlansModal";
import { useModal } from "@/providers/modal-provider";
import { GithubLogo } from "@phosphor-icons/react";
import { useTheme } from "@/providers/theme-provider";
import Logo from "./logo";
import ThemeToggle from "./misc/ThemeToggle";
import { create } from "zustand";
import { AnimatePresence, motion } from "motion/react";
import Toolbar from "./Toolbar";
import { url } from "inspector";

type SidebarStore = {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen: boolean) => set({ sidebarOpen }),
}));

export default function Sidebar() {
  const { data, db } = useDatabase();
  const params = useParams();
  const { user, profile } = useAuth();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : undefined;
  const [messageCount, setMessageCount] = useState<number>(0);
  const { theme, setTheme } = useTheme();
  const { showModal } = useModal();
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();

  useEffect(() => {
    console.log(data?.conversations)
  }, [data]);
  
  const url = db.auth.createAuthorizationURL({
    clientName: "google-web",
    redirectURL: window.location.href,
  });
  return (


    <AnimatePresence mode="popLayout">
      {sidebarOpen && (
    <motion.div initial={{ x: -300 }} animate={{ x: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} exit={{ x: -300, transition: { duration: 0.3, ease: "easeInOut" } }} className={`w-64 h-full bg-gray-1 border-r border-gray-3 dark:border-gray-2 overflow-y-auto absolute top-0 left-0 lg:relative z-40 shrink-0`}>
      <div className="flex flex-row gap-2 justify-between  items-center px-2 pt-2 w-full pb-2">
        {user ? (
          <div className="flex flex-row gap-2 items-center border border-gray-3 dark:border-gray-3 hover:bg-gray-2 rounded-md px-2 py-1">
            <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.email.split("@")[0]}`} alt="User" className="w-4 h-4 rounded" />
            <p className="text-base text-gray-11">
              {user.email.split("@")[0]}
            </p>
          </div>
        ) : (
        <Link href={url} className="w-max flex flex-row gap-2 items-center bg-gray-2 border border-gray-4 dark:border-gray-4 hover:bg-gray-3 rounded-md px-2 py-1">
          <SignIn size={14} weight="bold" className="text-gray-11" />
          <p className="text-base text-gray-11">
            Sign in with Google
          </p>
        </Link>
        )}

          
          <Toolbar/>

          
        </div>
      {/* Credits */}

      {/* <div className="flex flex-row gap-2 px-2 py-2 dark:border-gray-2 justify-between items-center pt-4">
        <Link href="/" className="w-full flex flex-row gap-2 items-center bg-gray-2 border border-gray-4 dark:border-gray-4 hover:bg-gray-3 rounded-md px-2 py-1">
          <SignIn size={14} weight="bold" className="text-gray-11" />
          <p className="text-base text-gray-11">
            Sign in with Google
          </p>
        </Link>
      </div> */}

      
    

      <div className="flex flex-col px-2 gap-px border-b border-gray-3 dark:border-gray-2 pb-2">
        <Link href="/settings" className="flex flex-row gap-2 items-center hover:bg-gray-3 dark:hover:bg-gray-2 rounded-md px-2 py-1">
          <Gear size={14} weight="bold" className="text-gray-11" />
          <p className="text-base text-gray-11">
            Settings
          </p>
        </Link>
      </div>


      <div className="flex flex-row gap-2 items-center justify-between px-4 mb-2 mt-4"> 
        <p className="text-tiny font-mono uppercase text-gray-10 font-medium ">
          Conversations
        </p>

        <Link href="/" className="flex flex-row gap-2 items-center bg-gray-2 border border-gray-4 dark:border-gray-4 hover:bg-gray-3 rounded-md px-1 py-1">
          <Plus size={10} weight="bold" className="text-gray-11" />
        </Link>
      </div>

      {
        data && data.conversations.length === 0 && (
          <div className="flex flex-col gap-px px-4">
            <p className="text-xs text-gray-10 dark:text-gray-10">
              You don't have any conversations yet. Send a message to get started.
            </p>
          </div>
        )
      }

      <div className="flex flex-col gap-px px-2">
      {data && data.conversations.map((conversation: any) => (
         <Link href={`/conversations/${conversation.id}`} key={conversation.id} className={`flex flex-col hover:bg-gray-2 rounded-md px-2 py-1 ${conversation.id === id ? "bg-gray-2 font-medium" : ""}`}>
         <p className="text-base text-gray-11 transition-all duration-200">
           {conversation.name}
         </p>
         {/* <p className="text-xs text-gray-9 font-normal">
           Created {DateTime.fromISO(conversation.createdAt).toRelative()}
         </p> */}
       </Link>
      ))}
       </div>

    </motion.div>
    )}
    </AnimatePresence>
  );
}