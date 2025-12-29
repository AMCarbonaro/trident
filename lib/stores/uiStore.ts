import { create } from 'zustand';

interface UIStore {
  isDetailPanelOpen: boolean;
  openDetailPanel: () => void;
  closeDetailPanel: () => void;
  toggleDetailPanel: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isDetailPanelOpen: false,
  openDetailPanel: () => set({ isDetailPanelOpen: true }),
  closeDetailPanel: () => set({ isDetailPanelOpen: false }),
  toggleDetailPanel: () => set((state) => ({ isDetailPanelOpen: !state.isDetailPanelOpen })),
}));


