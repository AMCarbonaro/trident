import { FunnelStage } from '@/lib/types/lead';

// Default funnel stages in order
export const DEFAULT_STAGES: FunnelStage[] = [
  FunnelStage.INSTAGRAM_FOLLOWED,
  FunnelStage.INSTAGRAM_FOLLOWED_BACK,
  FunnelStage.INSTAGRAM_DM_SENT,
  FunnelStage.ENGAGED_IN_DM_CONVERSATION,
  FunnelStage.ASKED_FOR_THE_SNAP,
  FunnelStage.SNAPCHAT_ADDED,
  FunnelStage.SNAPCHAT_ADDED_BACK,
  FunnelStage.INITIAL_SNAP_SENT_RECEIVED,
  FunnelStage.SNAPCHAT_CONVERSATION,
  FunnelStage.HEATED_SNAPCHAT_CONVERSATION,
  FunnelStage.THE_ASK,
  FunnelStage.ASK_DELIVERED,
  FunnelStage.PAID,
  FunnelStage.RETURNING_CUSTOMER,
  FunnelStage.SATISFIED_CUSTOMER,
  FunnelStage.DORMANT,
];

// Stage display names
export const STAGE_LABELS: Record<FunnelStage, string> = {
  [FunnelStage.INSTAGRAM_FOLLOWED]: "Instagram Followed",
  [FunnelStage.INSTAGRAM_FOLLOWED_BACK]: "Instagram Followed Back",
  [FunnelStage.INSTAGRAM_DM_SENT]: "Instagram DM Sent",
  [FunnelStage.ENGAGED_IN_DM_CONVERSATION]: "Engaged In DM Conversation",
  [FunnelStage.ASKED_FOR_THE_SNAP]: "Asked for the Snap",
  [FunnelStage.SNAPCHAT_ADDED]: "Snapchat Added",
  [FunnelStage.SNAPCHAT_ADDED_BACK]: "Snapchat Added Back",
  [FunnelStage.INITIAL_SNAP_SENT_RECEIVED]: "Initial Snap Sent/Received",
  [FunnelStage.SNAPCHAT_CONVERSATION]: "Snapchat Conversation",
  [FunnelStage.HEATED_SNAPCHAT_CONVERSATION]: "Heated Snapchat Conversation",
  [FunnelStage.THE_ASK]: "The Ask",
  [FunnelStage.ASK_DELIVERED]: "Ask Delivered",
  [FunnelStage.PAID]: "Paid",
  [FunnelStage.RETURNING_CUSTOMER]: "Returning Customer",
  [FunnelStage.SATISFIED_CUSTOMER]: "Satisfied Customer",
  [FunnelStage.DORMANT]: "Dormant",
};

// Stage colors (subtle backgrounds) - gradient from early to late stages
export const STAGE_COLORS: Record<FunnelStage, string> = {
  [FunnelStage.INSTAGRAM_FOLLOWED]: "bg-gray-50 dark:bg-gray-900",
  [FunnelStage.INSTAGRAM_FOLLOWED_BACK]: "bg-gray-100 dark:bg-gray-800",
  [FunnelStage.INSTAGRAM_DM_SENT]: "bg-blue-50 dark:bg-blue-950",
  [FunnelStage.ENGAGED_IN_DM_CONVERSATION]: "bg-blue-100 dark:bg-blue-900",
  [FunnelStage.ASKED_FOR_THE_SNAP]: "bg-blue-200 dark:bg-blue-700",
  [FunnelStage.SNAPCHAT_ADDED]: "bg-indigo-100 dark:bg-indigo-900",
  [FunnelStage.SNAPCHAT_ADDED_BACK]: "bg-purple-50 dark:bg-purple-950",
  [FunnelStage.INITIAL_SNAP_SENT_RECEIVED]: "bg-purple-100 dark:bg-purple-900",
  [FunnelStage.SNAPCHAT_CONVERSATION]: "bg-pink-50 dark:bg-pink-950",
  [FunnelStage.HEATED_SNAPCHAT_CONVERSATION]: "bg-pink-100 dark:bg-pink-900",
  [FunnelStage.THE_ASK]: "bg-yellow-50 dark:bg-yellow-950",
  [FunnelStage.ASK_DELIVERED]: "bg-orange-50 dark:bg-orange-950",
  [FunnelStage.PAID]: "bg-green-50 dark:bg-green-950",
  [FunnelStage.RETURNING_CUSTOMER]: "bg-emerald-50 dark:bg-emerald-950",
  [FunnelStage.SATISFIED_CUSTOMER]: "bg-teal-50 dark:bg-teal-950",
  [FunnelStage.DORMANT]: "bg-slate-50 dark:bg-slate-900",
};

