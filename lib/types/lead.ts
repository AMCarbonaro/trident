// Funnel stages enum
export enum FunnelStage {
  INSTAGRAM_FOLLOWED = "instagram_followed",
  INSTAGRAM_FOLLOWED_BACK = "instagram_followed_back",
  INSTAGRAM_DM_SENT = "instagram_dm_sent",
  ENGAGED_IN_DM_CONVERSATION = "engaged_in_dm_conversation",
  ASKED_FOR_THE_SNAP = "asked_for_the_snap",
  SNAPCHAT_ADDED = "snapchat_added",
  SNAPCHAT_ADDED_BACK = "snapchat_added_back",
  INITIAL_SNAP_SENT_RECEIVED = "initial_snap_sent_received",
  SNAPCHAT_CONVERSATION = "snapchat_conversation",
  HEATED_SNAPCHAT_CONVERSATION = "heated_snapchat_conversation",
  THE_ASK = "the_ask",
  ASK_DELIVERED = "ask_delivered",
  PAID = "paid",
  RETURNING_CUSTOMER = "returning_customer",
  SATISFIED_CUSTOMER = "satisfied_customer",
  DORMANT = "dormant"
}

// Platform identity
export interface PlatformIdentity {
  instagram?: {
    username: string;
    displayName?: string;
    profileUrl?: string;
  };
  snapchat?: {
    username: string;
    displayName?: string;
  };
}

// Engagement metrics
export interface EngagementMetrics {
  replySpeed: number;           // Average hours to reply
  activityLevel: "high" | "medium" | "low";
  lastActivityAt: Date;
  totalInteractions: number;
  engagementScore: number;      // Calculated 0-100
}

// Monetization data
export interface MonetizationData {
  offers: Array<{
    id: string;
    amount: number;
    currency: string;
    description: string;
    createdAt: Date;
    status: "pending" | "accepted" | "declined" | "expired";
  }>;
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    method: string;
    receivedAt: Date;
    offerId?: string;
  }>;
  totalRevenue: number;
  averageOfferValue: number;
}

// Note
export interface Note {
  id: string;
  text: string;
  createdAt: Date;
}

// Reminder
export interface Reminder {
  id: string;
  type: "follow_up" | "payment_due" | "inactivity" | "custom";
  message: string;
  dueAt: Date;
  completedAt?: Date;
  priority: "high" | "medium" | "low";
}

// Lead interface
export interface Lead {
  id: string;
  platforms: PlatformIdentity;
  displayName: string;           // Primary name to show
  stage: FunnelStage;
  tags: string[];
  notes: Note[];
  engagement: EngagementMetrics;
  monetization: MonetizationData;
  reminders: Reminder[];
  priority: "high" | "medium" | "low";
  isHighValue: boolean;
  isDormant: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastContactAt?: Date;
  metadata: {
    source?: string;             // How they found you
    referredBy?: string;
    customFields?: Record<string, any>;
  };
}

// Helper type for creating new leads
export type LeadInput = Omit<Lead, "id" | "createdAt" | "updatedAt">;

