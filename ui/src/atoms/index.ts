import { atom } from 'recoil';

export const currentUserNameStateAtom = atom({
  key: 'current-user-name-state',
  default: '',
});

export const webSocketConnectionStateAtom = atom({
  key: 'web-socket-state',
  default: 'disconnected',
});

