import { atom } from 'recoil';

export type IChatHistory = {
  id: string,
  name: string,
  message: string,
};

export const chatHistoryAtom = atom<IChatHistory[]>({
  key: 'chat-history',
  default: [],
});

