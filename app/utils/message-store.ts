import { create } from 'zustand';

export const useMessageStore = create((set) => ({
  message: "",
  setMessage: (message: string) => set({ message }),
})); 