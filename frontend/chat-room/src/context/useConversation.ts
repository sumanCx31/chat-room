import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  messages: [],

  setSelectedConversation: (c: any) =>
    set({ selectedConversation: c }),

  setMessages: (value: any) =>
    set((state: any) => ({
      messages:
        typeof value === "function"
          ? value(state.messages)
          : value,
    })),
}));

export default useConversation;