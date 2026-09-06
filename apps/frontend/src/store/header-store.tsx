import type {TBreadcrumb} from '@/components/header';
import {create} from 'zustand';

type HeaderStore = {
  breadcrumb: TBreadcrumb[];
  setBreadcrumb: (breadcrumb: TBreadcrumb[]) => void;
};
export const useHeader = create<HeaderStore>(set => ({
  breadcrumb: [],
  setBreadcrumb: (breadcrumb: TBreadcrumb[]) => {
    set({breadcrumb: breadcrumb});
  }
}));
