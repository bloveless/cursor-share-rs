import { atom } from 'recoil';

export type ICursor = {
  id: string,
  name: string,
  x: number,
  y: number,
};

export const cursorsAtom = atom<ICursor[]>({
  key: 'cursors',
  default: [],
});

