import { atom } from 'recoil';

const currentUserNameStateAtom = atom({
  key: 'current-user-name-state',
  default: '',
});

const webSocketConnectionStateAtom = atom({
  key: 'web-socket-state',
  default: 'disconnected',
});

export {
  currentUserNameStateAtom,
  webSocketConnectionStateAtom,
}
