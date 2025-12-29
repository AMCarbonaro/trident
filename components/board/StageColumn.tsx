'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FunnelStage } from '@/lib/types/lead';
import { STAGE_LABELS, STAGE_COLORS } from '@/lib/constants/stages';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StageColumnProps {
  stage: FunnelStage;
  leadCount: number;
  children: React.ReactNode;
  onAddLead: () => void;
}

export const StageColumn = React.memo(function StageColumn({ stage, leadCount, children, onAddLead }: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-shrink-0 w-80 flex flex-col h-full relative',
        STAGE_COLORS[stage],
        isOver && 'ring-2 ring-accent ring-offset-2 ring-opacity-100'
      )}
      role="region"
      aria-label={`${STAGE_LABELS[stage]} stage with ${leadCount} leads`}
    >
      {/* Header - clickable button but allows drag through */}
      <div className="p-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {STAGE_LABELS[stage]}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400" aria-live="polite">
                {leadCount} {leadCount === 1 ? 'lead' : 'leads'}
              </span>
              {leadCount > 10 && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                  {leadCount}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddLead();
            }}
            className="h-8 w-8 p-0 flex-shrink-0 ml-2 relative z-10"
            aria-label={`Add lead to ${STAGE_LABELS[stage]}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-2 min-h-0">
        {children}
      </div>
      {/* Drop indicator when dragging over */}
      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-accent bg-accent/5 pointer-events-none z-0" />
      )}
    </div>
  );
});

