import { Lead, FunnelStage } from '@/lib/types/lead';

// Simple, transparent scoring (0-100)
export function calculateEngagementScore(lead: Lead): number {
  let score = 50; // Base score
  
  // Reply speed (faster = higher)
  if (lead.engagement.replySpeed < 2) score += 20;
  else if (lead.engagement.replySpeed < 6) score += 10;
  else if (lead.engagement.replySpeed > 24) score -= 15;
  
  // Activity level
  if (lead.engagement.activityLevel === "high") score += 15;
  else if (lead.engagement.activityLevel === "low") score -= 10;
  
  // Funnel stage (advanced = higher)
  // Weights reflect progression through the funnel
  const stageWeights: Record<FunnelStage, number> = {
    // Early Instagram stages (0-8 points)
    [FunnelStage.INSTAGRAM_FOLLOWED]: 0,
    [FunnelStage.INSTAGRAM_FOLLOWED_BACK]: 3,
    [FunnelStage.INSTAGRAM_DM_SENT]: 6,
    [FunnelStage.ENGAGED_IN_DM_CONVERSATION]: 10,
    
    // Platform transition (10-18 points)
    [FunnelStage.ASKED_FOR_THE_SNAP]: 12,
    [FunnelStage.SNAPCHAT_ADDED]: 15,
    [FunnelStage.SNAPCHAT_ADDED_BACK]: 18,
    [FunnelStage.INITIAL_SNAP_SENT_RECEIVED]: 20,
    
    // Active Snapchat engagement (20-28 points)
    [FunnelStage.SNAPCHAT_CONVERSATION]: 22,
    [FunnelStage.HEATED_SNAPCHAT_CONVERSATION]: 28,
    
    // Monetization stages (28-35 points)
    [FunnelStage.THE_ASK]: 30,
    [FunnelStage.ASK_DELIVERED]: 32,
    [FunnelStage.PAID]: 35,
    
    // Post-purchase (lower engagement, but still valuable)
    [FunnelStage.RETURNING_CUSTOMER]: 30,
    [FunnelStage.SATISFIED_CUSTOMER]: 20,
    
    // Inactive
    [FunnelStage.DORMANT]: -25,
  };
  score += stageWeights[lead.stage] || 0;
  
  // Recent activity bonus
  const daysSinceActivity = (Date.now() - lead.engagement.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceActivity < 1) score += 10;
  else if (daysSinceActivity > 7) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

// Update engagement score on a lead
export function updateEngagementScore(lead: Lead): Lead {
  const score = calculateEngagementScore(lead);
  return {
    ...lead,
    engagement: {
      ...lead.engagement,
      engagementScore: score,
    },
  };
}

