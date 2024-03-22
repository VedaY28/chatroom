"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ChatPresence from "./ChatPresence";
import { Moon, Sun } from "lucide-react";
import { toast } from "sonner";

export default function ChatHeader({ user }: { user: User | undefined }) {
  
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loginOptionsOpen, setLoginOptionsOpen] = useState(false);

  // console.log(user);
  console.log(user);


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

  const handleLoginWithDiscord = () => {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLoginWithGoogle = () => {
    toast.message("Google Is Not Implemented Yet");
  }

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleLoginOptionsToggle = () => {
    setLoginOptionsOpen(!loginOptionsOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLoginOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <>
              <div className="relative">
                <Button onClick={handleLoginOptionsToggle}>Login</Button>
                {loginOptionsOpen && (
                  <div ref={dropdownRef} className="absolute top-0 left-full ml-2 bg-black border border-purple-300 p-2 rounded shadow-lg min-w-max">
                    <button className="block w-full text-left py-1 text-white hover:bg-gray-500" onClick={handleLoginWithGithub}>GitHub</button>
                    <button className="block w-full text-left py-1 text-white hover:bg-gray-500" onClick={handleLoginWithGoogle}>Google</button>
                    <button className="block w-full text-left py-1 text-white hover:bg-gray-500" onClick={handleLoginWithDiscord}>Discord</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}