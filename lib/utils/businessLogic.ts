import { Lead, FunnelStage, Reminder } from '@/lib/types/lead';
import { calculateEngagementScore } from './engagement';

// Priority calculation based on stage and engagement
export function calculatePriority(lead: Lead): "high" | "medium" | "low" {
  // High value customers are always high priority
  if (lead.isHighValue) return "high";
  
  // Critical monetization stages are high priority
  if (
    lead.stage === FunnelStage.THE_ASK ||
    lead.stage === FunnelStage.ASK_DELIVERED ||
    lead.stage === FunnelStage.HEATED_SNAPCHAT_CONVERSATION ||
    lead.stage === FunnelStage.PAID
  ) return "high";
  
  // High engagement score indicates active interest
  if (lead.engagement.engagementScore > 70) return "high";
  
  // Dormant leads are low priority
  if (lead.stage === FunnelStage.DORMANT) return "low";
  
  // Very low engagement indicates disinterest
  if (lead.engagement.engagementScore < 30) return "low";
  
  // Early stages with good engagement can be medium-high
  if (
    (lead.stage === FunnelStage.SNAPCHAT_CONVERSATION ||
     lead.stage === FunnelStage.SNAPCHAT_ADDED_BACK ||
     lead.stage === FunnelStage.ENGAGED_IN_DM_CONVERSATION) &&
    lead.engagement.engagementScore > 50
  ) return "medium";
  
  return "medium";
}

// Check if lead is high value
export function isHighValue(lead: Lead): boolean {
  return (
    lead.monetization.totalRevenue > 500 ||
    lead.engagement.engagementScore > 75
  );
}

// Check if lead should be marked dormant
export function shouldBeDormant(lead: Lead): boolean {
  const daysSinceActivity = (Date.now() - lead.engagement.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceActivity > 14 && lead.stage !== FunnelStage.DORMANT;
}

// Generate reminders for a lead
export function generateReminders(lead: Lead): Reminder[] {
  const reminders: Reminder[] = [];
  const now = new Date();
  
  // No response > 3 days
  if (lead.lastContactAt) {
    const daysSinceContact = (now.getTime() - lead.lastContactAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceContact > 3 && lead.stage !== FunnelStage.DORMANT) {
      reminders.push({
        id: `follow-up-${lead.id}`,
        type: "follow_up",
        message: `Follow up with ${lead.displayName}`,
        dueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        priority: daysSinceContact > 7 ? "high" : "medium",
      });
    }
  }
  
  // In "The Ask" stage but no delivery yet - follow up
  if (lead.stage === FunnelStage.THE_ASK) {
    const daysSinceAsk = lead.lastContactAt 
      ? (now.getTime() - lead.lastContactAt.getTime()) / (1000 * 60 * 60 * 24)
      : 0;
    if (daysSinceAsk > 2) {
      reminders.push({
        id: `follow-up-ask-${lead.id}`,
        type: "follow_up",
        message: `Follow up on "The Ask" with ${lead.displayName}`,
        dueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        priority: "high",
      });
    }
  }
  
  // Paid + not yet satisfied - deliver service
  if (lead.stage === FunnelStage.PAID) {
    const hasRecentPayment = lead.monetization.payments.some(
      payment => {
        const daysSincePayment = (now.getTime() - payment.receivedAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysSincePayment < 7;
      }
    );
    if (hasRecentPayment && ![FunnelStage.SATISFIED_CUSTOMER, FunnelStage.RETURNING_CUSTOMER, FunnelStage.PAID].includes(lead.stage)) {
      reminders.push({
        id: `deliver-${lead.id}`,
        type: "custom",
        message: `Deliver service to ${lead.displayName} - they've paid`,
        dueAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
        priority: "high",
      });
    }
  }
  
  // Returning customer - opportunity for upsell
  if (lead.stage === FunnelStage.RETURNING_CUSTOMER) {
    const daysSinceActivity = (now.getTime() - lead.engagement.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity < 3) {
      reminders.push({
        id: `upsell-${lead.id}`,
        type: "custom",
        message: `Upsell opportunity with ${lead.displayName}`,
        dueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        priority: "medium",
      });
    }
  }
  
  // High value + inactive > 7 days
  if (isHighValue(lead)) {
    const daysSinceActivity = (now.getTime() - lead.engagement.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity > 7 && lead.stage !== FunnelStage.DORMANT) {
      reminders.push({
        id: `reengage-${lead.id}`,
        type: "follow_up",
        message: `Re-engage with ${lead.displayName}`,
        dueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        priority: "high",
      });
    }
  }
  
  // Stage-specific progression reminders
  // Stuck in Instagram DM - suggest asking for Snap
  if (lead.stage === FunnelStage.ENGAGED_IN_DM_CONVERSATION) {
    const daysInStage = (now.getTime() - lead.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysInStage > 3 && lead.engagement.totalInteractions > 5) {
      reminders.push({
        id: `ask-for-snap-${lead.id}`,
        type: "custom",
        message: `Ask ${lead.displayName} for their Snapchat`,
        dueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        priority: "medium",
      });
    }
  }
  
  // Added on Snapchat but no initial snap sent
  if (lead.stage === FunnelStage.SNAPCHAT_ADDED_BACK) {
    const daysInStage = (now.getTime() - lead.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysInStage > 1) {
      reminders.push({
        id: `send-initial-snap-${lead.id}`,
        type: "custom",
        message: `Send initial snap to ${lead.displayName}`,
        dueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        priority: "medium",
      });
    }
  }
  
  // Inactivity reminder
  const daysSinceActivity = (now.getTime() - lead.engagement.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceActivity > 14 && lead.stage !== FunnelStage.DORMANT) {
    reminders.push({
      id: `inactivity-${lead.id}`,
      type: "inactivity",
      message: `${lead.displayName} has been inactive for ${Math.floor(daysSinceActivity)} days`,
      dueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      priority: "medium",
    });
  }
  
  return reminders;
}

// Update lead with calculated fields
export function updateLeadCalculations(lead: Lead): Lead {
  const updatedLead = { ...lead };
  
  // Update engagement score
  const score = calculateEngagementScore(lead);
  updatedLead.engagement = {
    ...lead.engagement,
    engagementScore: score,
  };
  
  // Update priority
  updatedLead.priority = calculatePriority(updatedLead);
  
  // Update high value flag
  updatedLead.isHighValue = isHighValue(updatedLead);
  
  // Update dormant flag
  updatedLead.isDormant = shouldBeDormant(updatedLead);
  
  // Generate and merge reminders
  const newReminders = generateReminders(updatedLead);
  const existingReminderIds = new Set(lead.reminders.map(r => r.id));
  const mergedReminders = [
    ...lead.reminders.filter(r => !r.completedAt),
    ...newReminders.filter(r => !existingReminderIds.has(r.id)),
  ];
  updatedLead.reminders = mergedReminders;
  
  return updatedLead;
}

