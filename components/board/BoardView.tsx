'use client';

import React, { useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useLeadStore } from '@/lib/stores/leadStore';
import { sortLeads, SortOption } from '@/lib/utils/filters';
import { DEFAULT_STAGES } from '@/lib/constants/stages';
import { FunnelStage } from '@/lib/types/lead';
import { StageColumn } from './StageColumn';
import { LeadCard } from '@/components/lead/LeadCard';
import { SortableLeadCard } from './SortableLeadCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUIStore } from '@/lib/stores/uiStore';
import { AddLeadModal } from '@/components/lead/AddLeadModal';

export function BoardView() {
  const { leads, moveLead, setSelectedLeadId, fetchLeads } = useLeadStore();
  const { openDetailPanel, isDetailPanelOpen } = useUIStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<SortOption>('priority');
  const [manualOrder, setManualOrder] = React.useState<Record<string, number>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sort leads, but preserve manual order within each stage
  const sortedLeads = React.useMemo(() => {
    // First sort by the selected sort option
    const sorted = sortLeads(leads, sortBy);
    
    // Then group by stage and apply manual ordering within each stage
    const grouped: Record<FunnelStage, typeof sorted> = {} as any;
    DEFAULT_STAGES.forEach(stage => {
      grouped[stage] = [];
    });
    sorted.forEach(lead => {
      if (!grouped[lead.stage]) {
        grouped[lead.stage] = [];
      }
      grouped[lead.stage].push(lead);
    });
    
    // Apply manual order within each stage
    DEFAULT_STAGES.forEach(stage => {
      if (grouped[stage].length > 0) {
        grouped[stage].sort((a, b) => {
          const aOrder = manualOrder[a.id];
          const bOrder = manualOrder[b.id];
          // If both have manual order, use it
          if (aOrder !== undefined && bOrder !== undefined) {
            return aOrder - bOrder;
          }
          // If only one has manual order, it comes first
          if (aOrder !== undefined) return -1;
          if (bOrder !== undefined) return 1;
          // Otherwise keep original sort order
          return 0;
        });
      }
    });
    
    // Flatten back to array
    return DEFAULT_STAGES.flatMap(stage => grouped[stage] || []);
  }, [leads, sortBy, manualOrder]);

  // Group leads by stage
  const leadsByStage = React.useMemo(() => {
    const grouped: Record<FunnelStage, typeof sortedLeads> = {} as any;
    DEFAULT_STAGES.forEach(stage => {
      grouped[stage] = [];
    });
    sortedLeads.forEach(lead => {
      if (!grouped[lead.stage]) {
        grouped[lead.stage] = [];
      }
      grouped[lead.stage].push(lead);
    });
    return grouped;
  }, [sortedLeads]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    const activeLead = leads.find(l => l.id === leadId);
    if (!activeLead) return;

    // Check if dropping on another lead (reordering within same column)
    const overLead = leads.find(l => l.id === over.id);
    if (overLead && activeLead.stage === overLead.stage) {
      // Reordering within the same column
      const stageLeads = leadsByStage[activeLead.stage] || [];
      const oldIndex = stageLeads.findIndex(l => l.id === leadId);
      const newIndex = stageLeads.findIndex(l => l.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        // Update manual order for all leads in this stage
        const reorderedStageLeads = arrayMove(stageLeads, oldIndex, newIndex);
        const newManualOrder = { ...manualOrder };
        
        reorderedStageLeads.forEach((lead, index) => {
          newManualOrder[lead.id] = index;
        });
        
        setManualOrder(newManualOrder);
      }
      return;
    }

    // Check if dropping on a stage column
    const newStage = over.id as FunnelStage;
    if (DEFAULT_STAGES.includes(newStage)) {
      moveLead(leadId, newStage).catch((error) => {
        console.error('Failed to move lead:', error);
      });
    }
  };

  const handleCardClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    openDetailPanel();
  };

  const [addLeadModalOpen, setAddLeadModalOpen] = React.useState(false);
  const [addLeadStage, setAddLeadStage] = React.useState<FunnelStage | undefined>();

  const handleAddLead = (stage?: FunnelStage) => {
    setAddLeadStage(stage);
    setAddLeadModalOpen(true);
  };

  const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 px-4 h-full">
        {DEFAULT_STAGES.map((stage) => {
          const stageLeads = leadsByStage[stage] || [];
          
          return (
            <StageColumn
              key={stage}
              stage={stage}
              leadCount={stageLeads.length}
              onAddLead={() => handleAddLead(stage)}
            >
              <SortableContext
                items={stageLeads.map(l => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {stageLeads.length === 0 ? (
                  <EmptyState
                    title="No leads"
                    description="Add a lead to get started"
                    actionLabel="Add Lead"
                    onAction={() => handleAddLead(stage)}
                  />
                ) : (
                  stageLeads.map((lead) => (
                    <SortableLeadCard
                      key={lead.id}
                      lead={lead}
                      onClick={() => handleCardClick(lead.id)}
                    />
                  ))
                )}
              </SortableContext>
            </StageColumn>
          );
        })}
      </div>
      <DragOverlay>
        {activeLead ? (
          <div className="opacity-50">
            <LeadCard lead={activeLead} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
    <AddLeadModal
      isOpen={addLeadModalOpen}
      onClose={() => setAddLeadModalOpen(false)}
      defaultStage={addLeadStage}
    />
    </>
  );
}

