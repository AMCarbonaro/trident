'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useFilterStore } from '@/lib/stores/filterStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function FilterBar() {
  const { activeFilters, setFilters, clearFilters, savedViews, loadView, activeViewId, fetchSavedViews } = useFilterStore();
  
  useEffect(() => {
    fetchSavedViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [searchQuery, setSearchQuery] = useState(activeFilters.searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFilters({ searchQuery: value });
  };

  const hasActiveFilters = 
    activeFilters.stages.length > 0 ||
    activeFilters.tags.length > 0 ||
    activeFilters.priority.length > 0 ||
    activeFilters.searchQuery.trim() !== '';

  return (
    <div className="border-b border-border bg-background px-4 py-3">
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
              aria-label="Search leads"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedViews.map((view) => (
            <Button
              key={view.id}
              variant={activeViewId === view.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => loadView(view.id)}
            >
              {view.name}
            </Button>
          ))}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

