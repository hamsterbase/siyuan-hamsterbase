import { create } from 'zustand';

export const useSiyuanState = create<{
  siyuanAccessAble: boolean;
  setSiyuanAccessAble: (value: boolean) => void;
}>((set) => ({
  siyuanAccessAble: false,
  setSiyuanAccessAble: (siyuanAccessAble: boolean) => {
    set((state) => ({ ...state, siyuanAccessAble }));
  },
}));
