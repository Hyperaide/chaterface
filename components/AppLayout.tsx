'use client';

import Button from "@/components/button";
import Logo from "@/components/logo";
import { Plus, MoonStars, Sun, ArrowRight, SignOut, SignIn, DiamondsFour, CreditCard, GithubLogo, Book } from "@phosphor-icons/react";
import { useAuth } from "@/providers/auth-provider";
import { useDatabase } from "@/providers/database-provider";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import hotkeys from 'hotkeys-js';
import { useCreateConversation } from "@/app/utils/conversation"
import { AppSchema } from "@/instant.schema";
import { InstaQLEntity } from "@instantdb/react";
import NumberFlow from '@number-flow/react'
import PlansModal from "./modals/PlansModal";
import { useModal } from "@/providers/modal-provider";

// Define the expected shape of a conversation based on AppSchema
type Conversation = InstaQLEntity<AppSchema, "conversations">;

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, profile, db, sessionId } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messageCount, setMessageCount] = useState<number>(0);
  const pathname = usePathname();
  const { createConversationAndRedirect } = useCreateConversation();
  const { showModal } = useModal();
  // Determine the active conversation ID from the pathname
  const conversationId = pathname.startsWith('/conversations/') ? pathname.split('/').pop() : null;

  // Fetch conversations associated with the current session
  const { data } = db.useQuery({
    conversations: {
      $: {
        where: {
          or: [{ 'user.id': user?.id ?? '' }, { sessionId: sessionId ?? '' }],

        },
        order: { createdAt: "desc" }
      },
    },
    messages: {
      $: {
        where: {
          role: 'assistant',
          or: [{ 'conversation.sessionId': sessionId ?? '' }, { 'conversation.user.id': user?.id ?? '' }],
        }
      }
    }
  }, {
    ruleParams: {
      sessionId: sessionId ?? ''
    }
  });

  useEffect(() => {
    if (data?.conversations) {
      // No need to map createdAt to Date, keep as ISO string from DB
      setConversations(data.conversations as Conversation[]);
    }

    if (data?.messages) {
      setMessageCount(data.messages.length);
    }
  }, [data]);

  // Set up keyboard shortcuts
  useEffect(() => {
    // Shortcut 'n' to create a new conversation
    hotkeys('n', (event) => {
      // Prevent triggering shortcut if focus is inside an input or textarea
      if (!(event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        createConversationAndRedirect();
      }
    });

    return () => {
      hotkeys.unbind('n');
    };
  }, [createConversationAndRedirect]);

  const signOut = () => {
    db.auth.signOut();
  };

  const setTheme = async (theme: string) => {
    await db.transact(db.tx.userProfiles[profile?.id].update({ theme: theme }));
  };
  
  const url = db.auth.createAuthorizationURL({
    clientName: "google-web",
    redirectURL: window.location.href,
  });

  return (
    <div className={`flex flex-row h-dvh w-full overflow-hidden bg-sage-1 dark:bg-sage-1 ${profile?.theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className="flex flex-col p-2 overflow-y-auto items-start w-full max-w-64 overflow-hidden">
        <div className="flex flex-row gap-2 justify-between w-full items-center">
          <Logo style="small" className="my-2 ml-1" color={profile?.theme === 'dark' ? 'white' : 'black'}/>
          
          <div className="flex flex-row gap-1">
            { profile && (
              <button
                onClick={() => setTheme(profile?.theme === 'dark' ? 'light' : 'dark')}
                className="p-1 hover:bg-sage-3 dark:hover:bg-sage-4 rounded-md group transition-colors duration-300"
                aria-label={`Switch to ${profile?.theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {profile?.theme === 'light' ? (
                    <MoonStars size={16} weight="bold" className="text-sage-10 group-hover:text-sage-12 dark:text-sage-9 dark:group-hover:text-sage-11 transition-colors duration-300" />
                ) : (
                    <Sun size={16} weight="bold" className="text-sage-10 group-hover:text-sage-12 dark:text-sage-9 dark:group-hover:text-sage-11 transition-colors duration-300" />
                )}
              </button>
            )}

            {user ? (
              <button onClick={() => signOut()} className="p-1 hover:bg-sage-3 dark:hover:bg-sage-4 rounded-md group transition-colors duration-300">
                <SignOut size={16} weight="bold" className="text-sage-10 group-hover:text-sage-12 dark:text-sage-9 dark:group-hover:text-sage-11 transition-colors duration-300" />
              </button>
            ) : (
              <Link href={url} className="p-1 hover:bg-sage-3 dark:hover:bg-sage-4 rounded-md group transition-colors duration-300">
                <SignIn size={16} weight="bold" className="text-sage-10 group-hover:text-sage-12 dark:text-sage-9 dark:group-hover:text-sage-11 transition-colors duration-300" />
              </Link>
            )}
          </div>
        </div>
        {/* <Button onClick={createConversationAndRedirect} size="small" className="mt-2 w-full bg-sage-3 text-sage-11 hover:bg-sage-4 dark:bg-sage-3 dark:text-sage-11 dark:hover:bg-sage-4 duration-300 border border-sage-6 dark:border-sage-6" icon={<Plus size={16} weight="bold" />}>New Conversation</Button> */}

        

        <div className="flex flex-col gap-2 border bg-white dark:bg-sage-2 border-sage-3 dark:border-sage-3 rounded-md p-2 w-full mt-1 divide-y divide-sage-3">
          <div className="flex flex-row gap-2 items-center justify-between pb-2">
            <div className="flex flex-row gap-1 items-center">
              <DiamondsFour size={12} weight="fill" className="text-teal-9 group-hover:text-sage-12 transition-colors duration-300" />
              <NumberFlow value={user && profile?.credits ? profile?.credits : 100} className="text-xs font-semibold text-sage-12 dark:text-sage-12" />
            </div>
            { user ?
            (
              <div className="flex flex-row gap-1 items-center bg-sage-2 dark:bg-sage-3 dark:boder-sage-2 dark:hover:bg-sage-4  hover:border-sage-5 transition-colors duration-300 border border-sage-5 rounded-md p-1 px-2">
                <CreditCard size={12} weight="bold" className="text-sage-12 group-hover:text-sage-12 transition-colors duration-300" />
                <div onClick={() => {showModal(<PlansModal />)}} className="text-[11px] text-sage-12 font-medium hover:text-sage-12 transition-colors duration-300 hover:cursor-pointer">Add credits</div>
            
              </div>
            ) : null }
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-sage-10 dark:text-sage-10">Chaterface is a fully open source project by <Link href="https://x.com/dqnamo" target="_blank" className="font-medium text-sage-11 hover:text-sage-12 transition-colors duration-300">@dqnamo</Link> and <Link href="https://x.com/hyperaide" target="_blank" className="font-medium text-sage-11 hover:text-sage-12 transition-colors duration-300">Hyperaide</Link>.</p>
            <div className="flex flex-wrap w-full gap-2">
              <Link href="https://github.com/hyperaide/chaterface" target="_blank" className="flex flex-row items-center gap-1 group bg-sage-2 dark:bg-sage-4 hover:bg-sage-5 hover:border-sage-6 transition-colors duration-300 border border-sage-5 rounded-md p-1 px-2">
                <GithubLogo size={12} weight="bold" className="text-sage-11 dark:text-sage-11 group-hover:text-sage-12 transition-colors duration-300" />
                <p className="text-xs text-sage-11 dark:text-sage-11 hover:text-sage-12 transition-colors duration-300">Github</p>
                {/* <ArrowRight size={12} weight="bold" className="text-sage-11 dark:text-sage-11 group-hover:text-sage-12 transition-colors duration-300" /> */}
              </Link>
              <Link href="https://github.com/hyperaide/chaterface" target="_blank" className="flex flex-row items-center gap-1 group bg-sage-2 dark:bg-sage-4 hover:bg-sage-5 hover:border-sage-6 transition-colors duration-300 border border-sage-5 rounded-md p-1 px-2">
                <Book size={12} weight="bold" className="text-sage-11 dark:text-sage-11 group-hover:text-sage-12 transition-colors duration-300" />
                <p className="text-xs text-sage-11 dark:text-sage-11 hover:text-sage-12 transition-colors duration-300">Docs</p>
            
              </Link>
            </div>
          </div>

        </div>

        

        {/* Conversation List */}
        <div className="w-full flex flex-col h-full relative">
          <div className="flex flex-row items-center justify-between gap-2 py-4">
            <p className="text-xs font-mono px-2 text-sage-11 dark:text-sage-11">Conversations</p>
            <div onClick={createConversationAndRedirect} className="w-max bg-sage-3 text-sage-11 hover:bg-sage-4 dark:bg-sage-3 dark:text-sage-11 dark:hover:bg-sage-4 duration-300 border border-sage-6 dark:border-sage-6 rounded p-1 hover:cursor-pointer">
              <Plus size={8} weight="bold" />
            </div>
          </div>
          <div className="flex flex-col w-full overflow-y-auto gap-1 relative">
          
            {conversations.map(conv => (
              <div className="w-full flex">
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className={`text-sm px-2 py-1 w-full rounded-md hover:bg-sage-2 duration-300 truncate ${conv.id === conversationId ? 'bg-sage-3 font-medium text-sage-12 dark:text-sage-12' : 'text-sage-11 dark:text-sage-11'}`}
                >
                  {conv.name}
                </Link>
              </div>
            ))}
          </div>
        </div>




        {/* <div className="gap-2 flex flex-col w-full mt-4 flex-1 overflow-y-auto">
          <div className="flex flex-row items-center justify-between gap-2 sticky top-0 pb-1">
            <p className="text-xs font-mono px-2 text-sage-11 dark:text-sage-11">Conversations</p>
            <p className="text-xs font-mono px-2 text-sage-11 dark:text-sage-11"> {conversations.length} </p>
          </div>
          <div className="flex flex-col w-full gap-px relative">
            <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-sage-1 to-transparent p-2"/>

            {conversations.map(conv => (
              <Link
                key={conv.id}
                href={`/conversations/${conv.id}`}
                className={`text-sm px-2 py-1 rounded-md hover:bg-sage-3 dark:hover:bg-sage-4 duration-300 truncate ${conv.id === conversationId ? 'bg-sage-4 dark:bg-sage-5 font-medium text-sage-12 dark:text-sage-12' : 'text-sage-11 dark:text-sage-11'}`}
                title={conv.name}
              >
                {conv.name}
              </Link>
            ))}
          </div>
        </div> */}
      </div>

      {/* Main Content Area */}
      <div className="w-full bg-white dark:bg-sage-2 mr-2 my-2 rounded-lg overflow-hidden border border-sage-4 dark:border-sage-5">
        {children}
      </div>
    </div>
  );
} 