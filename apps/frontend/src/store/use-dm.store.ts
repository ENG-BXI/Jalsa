import {create} from 'zustand';
export type TDm = {
  id: string;
  name: string;
};
type DmStore = {
  Dm: TDm;
  setDm: (Dm: TDm) => void;
};
export const useDm = create<DmStore>(set => ({
  Dm: {id: '', name: ''},
  setDm: (Dm: TDm) => {
    set({Dm: Dm});
  }
}));
