import {create} from 'zustand';
type TUser = {
  id: string;
  email: string;
  name: string;
  userName: string;
  jointAt: string;
};
type TUseUser = {
  user: TUser | null;
  setUser: (user: TUser) => void;
};
export const useUser = create<TUseUser>(set => ({
  user: null,
  setUser: user => set({user})
}));
