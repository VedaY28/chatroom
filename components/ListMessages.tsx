"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import LoadMoreMessages from "./LoadMoreMessages";

export default function ListMessages() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotifcation] = useState(0);
  const { messages, addMessage, optimisticIds, deleteMessage, editMessage } =
    useMessage((state) => state);

  const supabase = supabaseBrowser();

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          // console.log("New message received:", payload.new);

          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from("users")
              .select("*")
              .eq("id", payload.new.send_by)
              .single();

            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };
              // console.log("Adding new message to state:", newMessage);
              addMessage(newMessage as Imessage);
            }
          }
          const scrollContainer = scrollRef.current;

          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotifcation((current) => current + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          deleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          editMessage(payload.new as Imessage);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  //When New Message Comes
  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      // console.log(isScroll);
      setUserScrolled(isScroll);
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotifcation(0);
      }
    }
  };

  const scrollDown = () => {
    setNotifcation(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <>
      <div
        className="flex-1 flex flex-col p-5 h-full overflow-y-auto bg-gradient-to-r from-orange-300 to-red-300" //bg-yellow-100
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        <div className="flex-1 pb-5">
          <LoadMoreMessages />
        </div>

        <div className=" space-y-7">
          {messages.map((value, index) => {
            return <Message key={index} message={value} />;
          })}
        </div>
        <DeleteAlert />
        <EditAlert />
      </div>

      {userScrolled && (
        <div className="absolute bottom-[90px] left-1/2 transform -translate-x-1/2">
          {notification ? (
            <div className="flex justify-center">
              <div
                className="w-36 h-8 bg-purple-500 p-1 rounded-md cursor-pointer hover:scale-110 transition-all"
                onClick={scrollDown}
              >
                <h1 className="text-white text-center">
                  New {notification} Messages
                </h1>
              </div>
            </div>
          ) : (
            <div
              className="w-40 h-10 text-white bg-blue-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
              onClick={scrollDown}
            >
              Scroll <ArrowDown /> Down
            </div>
          )}
        </div>
      )}
    </>
  );
}
