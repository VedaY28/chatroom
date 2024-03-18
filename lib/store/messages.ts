import { User } from "@supabase/supabase-js";
import { create } from "zustand";

export type Imessage = {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string;
  text: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
};

interface MessageState {
  messages: Imessage[];
  actionMessage: Imessage | undefined;
  optimisticIds: string[];
  addMessage: (message: Imessage) => void;
  setActionMessage: (message: Imessage | undefined) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (message: Imessage) => void;
  setOptimisticIds: (id: string) => void;
}

export const useMessage = create<MessageState>()((set) => ({
  messages: [],
  actionMessage: undefined,
  optimisticIds: [],
  setOptimisticIds: (id: string) =>
        set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),

  addMessage: (newMessages) =>
    set((state) => ({
      messages: [...state.messages, newMessages],
    })),

  setActionMessage: (message) => set(() => ({ actionMessage: message })),

  deleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => message.id !== messageId),
      };
    }),

  editMessage: (updateMessage) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => {
          if (message.id === updateMessage.id) {
            (message.text = updateMessage.text),
              (message.is_edit = updateMessage.is_edit);
          }
          return message;
        }),
      };
    }),
}));