"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ChatPresence from "./ChatPresence";
import { Moon, Sun } from "lucide-react";

export default function ChatHeader({ user }: { user: User | undefined }) {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply dark mode to the body when dark mode is enabled
    if (!darkMode) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  };

  const handleLoginWithGithub = () => {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="h-20 bg-gradient-to-r from-indigo-500 to-teal-500">
      <div className="p-5 border-b-4 border-purple-800 flex items-center justify-between h-full">
        <div>
          <h1 className="text-xl font-bold text-white">{"<Da-Chat-Room>"}</h1>
          <ChatPresence />
        </div>
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 flex items-center justify-center bg-zinc-500 rounded-full cursor-pointer hover:bg-zinc-600"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Moon /> : <Sun />}
          </div>
          {user ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <Button onClick={handleLoginWithGithub}>Login</Button>
          )}
        </div>
      </div>
    </div>
  );
}
