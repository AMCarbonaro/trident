'use client';

import React, { useEffect } from 'react';
import { useFilterStore } from '@/lib/stores/filterStore';
import { useUIStore } from '@/lib/stores/uiStore';

export function KeyboardShortcuts() {
  const { setFilters, activeFilters } = useFilterStore();
  const { closeDetailPanel } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search leads..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape to close panel
      if (e.key === 'Escape') {
        closeDetailPanel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeDetailPanel]);

  return null;
}


