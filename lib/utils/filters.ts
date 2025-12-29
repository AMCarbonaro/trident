import { Lead, FunnelStage } from '@/lib/types/lead';
import { FilterState } from '@/lib/stores/filterStore';

export function filterLeads(leads: Lead[], filters: FilterState): Lead[] {
  let filtered = [...leads];

  // Filter by stages
  if (filters.stages.length > 0) {
    filtered = filtered.filter((lead) => filters.stages.includes(lead.stage));
  }

  // Filter by tags
  if (filters.tags.length > 0) {
    filtered = filtered.filter((lead) =>
      filters.tags.some((tag) => lead.tags.includes(tag))
    );
  }

  // Filter by priority
  if (filters.priority.length > 0) {
    filtered = filtered.filter((lead) => filters.priority.includes(lead.priority));
  }

  // Filter by engagement score range
  if (filters.engagementScoreMin !== null) {
    filtered = filtered.filter(
      (lead) => lead.engagement.engagementScore >= filters.engagementScoreMin!
    );
  }
  if (filters.engagementScoreMax !== null) {
    filtered = filtered.filter(
      (lead) => lead.engagement.engagementScore <= filters.engagementScoreMax!
    );
  }

  // Search query (username, notes)
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((lead) => {
      const matchesName = lead.displayName.toLowerCase().includes(query);
      const matchesNotes = lead.notes.some((note) => note.text.toLowerCase().includes(query));
      const matchesInstagram = lead.platforms.instagram?.username.toLowerCase().includes(query);
      const matchesSnapchat = lead.platforms.snapchat?.username.toLowerCase().includes(query);
      const matchesTags = lead.tags.some((tag) => tag.toLowerCase().includes(query));
      
      return matchesName || matchesNotes || matchesInstagram || matchesSnapchat || matchesTags;
    });
  }

  return filtered;
}

export type SortOption = 
  | 'engagement-score'
  | 'last-activity'
  | 'revenue'
  | 'created-date'
  | 'priority';

export function sortLeads(leads: Lead[], sortBy: SortOption): Lead[] {
  const sorted = [...leads];

  switch (sortBy) {
    case 'engagement-score':
      return sorted.sort((a, b) => b.engagement.engagementScore - a.engagement.engagementScore);
    
    case 'last-activity':
      return sorted.sort(
        (a, b) => b.engagement.lastActivityAt.getTime() - a.engagement.lastActivityAt.getTime()
      );
    
    case 'revenue':
      return sorted.sort((a, b) => b.monetization.totalRevenue - a.monetization.totalRevenue);
    
    case 'created-date':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    case 'priority':
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    default:
      return sorted;
  }
}

