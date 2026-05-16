import type { User } from "./user";

export interface Message {
  _id?: string;
  chatId: string;
  sender: User;
  content: string;
  createdAt?: string;
}