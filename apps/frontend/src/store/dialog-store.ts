import type {ReactNode} from 'react';
import {create} from 'zustand';

type TAction = {
  text: string;
  formId?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export type DialogProps = {
  title: string | {title: string; className?: string};
  description?: string | {description: string; className?: string};
  content: ReactNode;
  className?: string;
  primaryAction?: TAction;
  secondaryAction?: TAction;
};

export type TAppDialog = {
  dialog: DialogProps | null;
  setDialog: (value: DialogProps) => void;
  disabled: boolean | null;
  setDisabled: (val: boolean | null) => void;
  onClose: () => void;
};

export const useAppDialog = create<TAppDialog>(set => ({
  dialog: null,
  disabled: null,
  setDisabled: val => set({disabled: val}),
  setDialog: value => {
    set({dialog: value});
  },

  onClose: () => {
    set({dialog: null});
  }
}));
