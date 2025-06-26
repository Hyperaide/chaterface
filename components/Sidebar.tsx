"use client"
import { useDatabase } from "@/providers/database-provider";
import { DateTime } from "luxon";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CreditCard, DiamondsFour, MoonStars, Plus, SidebarSimple, SignIn, SignOut, Sun } from "@phosphor-icons/react";
import NumberFlow from "@number-flow/react";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import PlansModal from "./modals/PlansModal";
import { useModal } from "@/providers/modal-provider";
import { GithubLogo } from "@phosphor-icons/react";
import { useTheme } from "@/providers/theme-provider";
import Logo from "./logo";
import ThemeToggle from "./misc/ThemeToggle";
import { create } from "zustand";
import { AnimatePresence, motion } from "motion/react";
import Toolbar from "./Toolbar";

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
  

  return (


    <AnimatePresence mode="popLayout">
      {sidebarOpen && (
    <motion.div initial={{ x: -300 }} animate={{ x: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} exit={{ x: -300, transition: { duration: 0.3, ease: "easeInOut" } }} className={`w-64 h-full bg-gray-1 border-r border-gray-3 dark:border-gray-2 overflow-y-auto p-2 absolute top-0 left-0 lg:relative z-40 shrink-0`}>
      <div className="flex flex-row gap-2 justify-between w-full items-center">
          <Logo style="small" className="my-2 ml-1" color={theme === 'dark' ? 'white' : 'black'}/>



          
          <Toolbar/>
        </div>
      {/* Credits */}
      <div className="flex flex-col gap-2 border bg-white dark:bg-gray-2 border-gray-3 dark:border-gray-3 rounded-md p-2 w-full mt-1 divide-y divide-gray-3">
          <div className="flex flex-row gap-2 items-center justify-between pb-2">
            <div className="flex flex-row gap-1 items-center">
              <DiamondsFour size={12} weight="fill" className="text-teal-9 group-hover:text-gray-12 transition-colors duration-300" />

              {user ? (
                <NumberFlow value={user && profile?.credits ? profile?.credits : 100} className="text-xs font-semibold text-gray-12 dark:text-gray-12" />
              ) : (
                <NumberFlow value={100 - messageCount} className="text-xs font-semibold text-gray-12 dark:text-gray-12" />
              )}
            </div>
            { user ?
            (
              <div className="flex flex-row gap-1 items-center bg-gray-2 dark:bg-gray-3 dark:boder-gray-2 dark:hover:bg-gray-4  hover:border-gray-5 transition-colors duration-300 border border-gray-5 rounded-md p-1 px-2">
                <CreditCard size={12} weight="bold" className="text-gray-12 group-hover:text-gray-12 transition-colors duration-300" />
                <div onClick={() => {showModal(<PlansModal />)}} className="text-[11px] text-gray-12 font-medium hover:text-gray-12 transition-colors duration-300 hover:cursor-pointer">Add credits</div>
            
              </div>
            ) : null }
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-10 dark:text-gray-10">Chaterface is a fully open source project by <Link href="https://x.com/dqnamo" target="_blank" className="font-medium text-gray-11 hover:text-gray-12 transition-colors duration-300">@dqnamo</Link> and <Link href="https://x.com/hyperaide" target="_blank" className="font-medium text-gray-11 hover:text-gray-12 transition-colors duration-300">Hyperaide</Link>.</p>
            <div className="flex flex-wrap w-full gap-2">
              <Link href="https://github.com/hyperaide/chaterface" target="_blank" className="flex flex-row items-center gap-1 group bg-gray-2 dark:bg-gray-4 hover:bg-gray-5 hover:border-gray-6 transition-colors duration-300 border border-gray-5 rounded-md p-1 px-2">
                <GithubLogo size={12} weight="bold" className="text-gray-11 dark:text-gray-11 group-hover:text-gray-12 transition-colors duration-300" />
                <p className="text-xs text-gray-11 dark:text-gray-11 hover:text-gray-12 transition-colors duration-300">Github</p>
                {/* <ArrowRight size={12} weight="bold" className="text-sage-11 dark:text-sage-11 group-hover:text-sage-12 transition-colors duration-300" /> */}
              </Link>
              {/* <Link href="https://github.com/hyperaide/chaterface" target="_blank" className="flex flex-row items-center gap-1 group bg-sage-2 dark:bg-sage-4 hover:bg-sage-5 hover:border-sage-6 transition-colors duration-300 border border-sage-5 rounded-md p-1 px-2">
                <Book size={12} weight="bold" className="text-sage-11 dark:text-sage-11 group-hover:text-sage-12 transition-colors duration-300" />
                <p className="text-xs text-sage-11 dark:text-sage-11 hover:text-sage-12 transition-colors duration-300">Docs</p>
            
              </Link> */}
            </div>
          </div>

        </div>


      <p className="text-tiny font-mono uppercase text-gray-10 font-medium px-2 mt-4 mb-2">
        Conversations
      </p>
      <div className="flex flex-col gap-px">
      {data && data.conversations.map((conversation: any) => (
         <Link href={`/conversations/${conversation.id}`} key={conversation.id} className={`flex flex-col hover:bg-gray-2 rounded-md px-2 py-1 ${conversation.id === id ? "bg-gray-2 font-medium" : ""}`}>
         <p className="text-base text-gray-11 transition-all duration-200">
           {conversation.name}
         </p>
         <p className="text-xs text-gray-9 font-normal">
           Created {DateTime.fromISO(conversation.createdAt).toRelative()}
         </p>
       </Link>
      ))}
       </div>

    </motion.div>
    )}
    </AnimatePresence>
  );
}