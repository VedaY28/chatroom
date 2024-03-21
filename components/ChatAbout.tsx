import React from "react";

export default function ChatAbout() {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-orange-300 to-red-300">
        <div className="text-center space-y-5">
          <h1 className="text-5xl font-bold text-purple-700">{"Welcome To <Chat-Room>"}</h1>
          <p className="w-90 mx-auto text-lg text-violet-800 font-semibold">
            This is a chat application that is powered by supabase realtime database. <br/>Login to send messages to other people.
          </p>
        </div>
      </div>
    );
  }
  
