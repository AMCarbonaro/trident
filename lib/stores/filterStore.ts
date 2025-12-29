import { create } from 'zustand';
import { FunnelStage } from '@/lib/types/lead';
import * as filterAPI from '@/lib/api/filters';

export interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
}

export interface FilterState {
  stages: FunnelStage[];
  tags: string[];
  priority: ("high" | "medium" | "low")[];
  searchQuery: string;
  engagementScoreMin: number | null;
  engagementScoreMax: number | null;
}

interface FilterStore {
  activeFilters: FilterState;
  savedViews: SavedView[];
  activeViewId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchSavedViews: () => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  saveView: (name: string) => Promise<void>;
  loadView: (viewId: string) => void;
  deleteView: (viewId: string) => Promise<void>;
  resetToDefault: () => void;
}

const defaultFilters: FilterState = {
  stages: [],
  tags: [],
  priority: [],
  searchQuery: '',
  engagementScoreMin: null,
  engagementScoreMax: null,
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  activeFilters: defaultFilters,
  savedViews: [],
  activeViewId: null,
  isLoading: false,
  error: null,

  fetchSavedViews: async () => {
    set({ isLoading: true, error: null });
    try {
      const views = await filterAPI.fetchSavedViews();
      set({ savedViews: views, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch saved views', isLoading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      activeFilters: { ...state.activeFilters, ...newFilters },
      activeViewId: null, // Clear active view when manually filtering
    }));
  },

  clearFilters: () => {
    set({
      activeFilters: defaultFilters,
      activeViewId: null,
    });
  },

  saveView: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const view = await filterAPI.createSavedView(name, get().activeFilters);
      set((state) => ({
        savedViews: [...state.savedViews, view],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to save view', isLoading: false });
      throw error;
    }
  },

  loadView: (viewId) => {
    const view = get().savedViews.find((v) => v.id === viewId);
    if (view) {
      set({
        activeFilters: view.filters,
        activeViewId: viewId,
      });
    }
  },

  deleteView: async (viewId) => {
    set({ isLoading: true, error: null });
    try {
      await filterAPI.deleteSavedView(viewId);
      set((state) => ({
        savedViews: state.savedViews.filter((v) => v.id !== viewId),
        activeViewId: state.activeViewId === viewId ? null : state.activeViewId,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete view', isLoading: false });
      throw error;
    }
  },

  resetToDefault: () => {
    set({
      activeFilters: defaultFilters,
      activeViewId: null,
    });
  },
}));

