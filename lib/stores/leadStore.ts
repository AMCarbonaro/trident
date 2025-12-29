import { create } from 'zustand';
import { Lead, FunnelStage, LeadInput, Note } from '@/lib/types/lead';
import { updateLeadCalculations } from '@/lib/utils/businessLogic';
import * as leadAPI from '@/lib/api/leads';

// Helper to migrate old string notes to new Note[] format
function migrateNotes(notes: string | Note[]): Note[] {
  if (Array.isArray(notes)) {
    // Already migrated, but ensure all notes have proper structure
    return notes.map(note => {
      if (typeof note === 'string') {
        return {
          id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: note,
          createdAt: new Date(),
        };
      }
      return note;
    });
  }
  // Old string format - convert to array
  if (typeof notes === 'string' && notes.trim()) {
    return [{
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: notes,
      createdAt: new Date(),
    }];
  }
  return [];
}

interface LeadStore {
  leads: Lead[];
  selectedLeadId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  addLead: (lead: LeadInput) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  moveLead: (id: string, newStage: FunnelStage) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  getLeadById: (id: string) => Lead | undefined;
  setSelectedLeadId: (id: string | null) => void;
  initializeWithSampleData: () => void;
}

export const useLeadStore = create<LeadStore>()((set, get) => ({
  leads: [],
  selectedLeadId: null,
  isLoading: false,
  error: null,

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const leads = await leadAPI.fetchLeads();
      set({ leads, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch leads', isLoading: false });
    }
  },

  addLead: async (leadInput: LeadInput) => {
    set({ isLoading: true, error: null });
    try {
      const leadInputWithMigratedNotes = {
        ...leadInput,
        notes: migrateNotes(leadInput.notes),
      };
      const newLead = await leadAPI.createLead(leadInputWithMigratedNotes);
      set((state: LeadStore) => ({
        leads: [...state.leads, newLead],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create lead', isLoading: false });
      throw error;
    }
  },

  updateLead: async (id: string, updates: Partial<Lead>) => {
    set({ isLoading: true, error: null });
    try {
      // Migrate notes if needed
      const migratedUpdates = updates.notes 
        ? { ...updates, notes: migrateNotes(updates.notes) }
        : updates;
      
      const updatedLead = await leadAPI.updateLead(id, migratedUpdates);
      set((state: LeadStore) => ({
        leads: state.leads.map((l: Lead) => (l.id === id ? updatedLead : l)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update lead', isLoading: false });
      throw error;
    }
  },

  moveLead: async (id: string, newStage: FunnelStage) => {
    set({ isLoading: true, error: null });
    try {
      const updatedLead = await leadAPI.moveLead(id, newStage);
      set((state: LeadStore) => ({
        leads: state.leads.map((l: Lead) => (l.id === id ? updatedLead : l)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to move lead', isLoading: false });
      throw error;
    }
  },

  deleteLead: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await leadAPI.deleteLead(id);
      set((state: LeadStore) => ({
        leads: state.leads.filter((l) => l.id !== id),
        selectedLeadId: state.selectedLeadId === id ? null : state.selectedLeadId,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete lead', isLoading: false });
      throw error;
    }
  },

      getLeadById: (id: string) => {
        return get().leads.find((l: Lead) => l.id === id);
      },

      setSelectedLeadId: (id: string | null) => {
        set({ selectedLeadId: id });
      },

  initializeWithSampleData: () => {
        const now = Date.now();
        const sampleLeads: Lead[] = [
          // Instagram Followed
          {
            id: 'sample-1',
            platforms: { instagram: { username: 'tyler_martinez', displayName: 'Tyler' } },
            displayName: 'Tyler',
            stage: FunnelStage.INSTAGRAM_FOLLOWED,
            tags: ['new'],
            notes: [{ id: 'n1', text: 'Just followed on Instagram', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 0, activityLevel: 'low', lastActivityAt: new Date(now - 1 * 24 * 60 * 60 * 1000), totalInteractions: 0, engagementScore: 0 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000), updatedAt: new Date(), metadata: {},
          },
          {
            id: 'sample-2',
            platforms: { instagram: { username: 'jake_wilson', displayName: 'Jake' } },
            displayName: 'Jake',
            stage: FunnelStage.INSTAGRAM_FOLLOWED,
            tags: ['new'],
            notes: [{ id: 'n2', text: 'New follower', createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 0, activityLevel: 'low', lastActivityAt: new Date(now - 2 * 24 * 60 * 60 * 1000), totalInteractions: 0, engagementScore: 0 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000), updatedAt: new Date(), metadata: {},
          },
          // Instagram Followed Back
          {
            id: 'sample-3',
            platforms: { instagram: { username: 'ryan_chen', displayName: 'Ryan' } },
            displayName: 'Ryan',
            stage: FunnelStage.INSTAGRAM_FOLLOWED_BACK,
            tags: ['followed-back'],
            notes: [{ id: 'n3', text: 'Followed back today', createdAt: new Date(now - 5 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 0, activityLevel: 'low', lastActivityAt: new Date(now - 5 * 60 * 60 * 1000), totalInteractions: 1, engagementScore: 3 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 5 * 60 * 60 * 1000), metadata: {},
          },
          // Instagram DM Sent
          {
            id: 'sample-4',
            platforms: { instagram: { username: 'marcus_jones', displayName: 'Marcus' } },
            displayName: 'Marcus',
            stage: FunnelStage.INSTAGRAM_DM_SENT,
            tags: ['dm-sent'],
            notes: [{ id: 'n4', text: 'Sent initial DM yesterday', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 24, activityLevel: 'low', lastActivityAt: new Date(now - 1 * 24 * 60 * 60 * 1000), totalInteractions: 1, engagementScore: 5 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 1 * 24 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-5',
            platforms: { instagram: { username: 'david_kim', displayName: 'David' } },
            displayName: 'David',
            stage: FunnelStage.INSTAGRAM_DM_SENT,
            tags: ['dm-sent'],
            notes: [{ id: 'n5', text: 'DM sent, waiting for response', createdAt: new Date(now - 12 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 24, activityLevel: 'low', lastActivityAt: new Date(now - 12 * 60 * 60 * 1000), totalInteractions: 1, engagementScore: 5 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 12 * 60 * 60 * 1000), metadata: {},
          },
          // Engaged In DM Conversation
          {
            id: 'sample-6',
            platforms: { instagram: { username: 'chris_taylor', displayName: 'Chris' } },
            displayName: 'Chris',
            stage: FunnelStage.ENGAGED_IN_DM_CONVERSATION,
            tags: ['engaged', 'responsive'],
            notes: [
              { id: 'n6a', text: 'Started DM conversation', createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000) },
              { id: 'n6b', text: 'Very responsive, replies quickly', createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000) },
            ],
            engagement: { replySpeed: 3, activityLevel: 'high', lastActivityAt: new Date(now - 3 * 60 * 60 * 1000), totalInteractions: 8, engagementScore: 18 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 6 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 3 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-7',
            platforms: { instagram: { username: 'brandon_lee', displayName: 'Brandon' } },
            displayName: 'Brandon',
            stage: FunnelStage.ENGAGED_IN_DM_CONVERSATION,
            tags: ['engaged'],
            notes: [{ id: 'n7', text: 'Active conversation, asking questions', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 5, activityLevel: 'medium', lastActivityAt: new Date(now - 8 * 60 * 60 * 1000), totalInteractions: 5, engagementScore: 13 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 8 * 60 * 60 * 1000), metadata: {},
          },
          // Asked for the Snap
          {
            id: 'sample-8',
            platforms: { instagram: { username: 'alex_rivera', displayName: 'Alex' } },
            displayName: 'Alex',
            stage: FunnelStage.ASKED_FOR_THE_SNAP,
            tags: ['snap-requested'],
            notes: [{ id: 'n8', text: 'Asked for Snapchat username', createdAt: new Date(now - 6 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 4, activityLevel: 'high', lastActivityAt: new Date(now - 6 * 60 * 60 * 1000), totalInteractions: 6, engagementScore: 22 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 8 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 6 * 60 * 60 * 1000), metadata: {},
          },
          // Snapchat Added
          {
            id: 'sample-9',
            platforms: { 
              instagram: { username: 'jordan_smith', displayName: 'Jordan' },
              snapchat: { username: 'jordan_snap' },
            },
            displayName: 'Jordan',
            stage: FunnelStage.SNAPCHAT_ADDED,
            tags: ['snapchat-added'],
            notes: [{ id: 'n9', text: 'Added on Snapchat, waiting for add back', createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 6, activityLevel: 'medium', lastActivityAt: new Date(now - 2 * 24 * 60 * 60 * 1000), totalInteractions: 7, engagementScore: 27 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 9 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 2 * 24 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-10',
            platforms: { 
              instagram: { username: 'noah_brown', displayName: 'Noah' },
              snapchat: { username: 'noah_b' },
            },
            displayName: 'Noah',
            stage: FunnelStage.SNAPCHAT_ADDED,
            tags: ['snapchat-added'],
            notes: [{ id: 'n10', text: 'Added on Snapchat yesterday', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 8, activityLevel: 'medium', lastActivityAt: new Date(now - 1 * 24 * 60 * 60 * 1000), totalInteractions: 4, engagementScore: 27 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 1 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Snapchat Added Back
          {
            id: 'sample-11',
            platforms: { 
              instagram: { username: 'ethan_davis', displayName: 'Ethan' },
              snapchat: { username: 'ethan_d' },
            },
            displayName: 'Ethan',
            stage: FunnelStage.SNAPCHAT_ADDED_BACK,
            tags: ['snapchat-added-back'],
            notes: [{ id: 'n11', text: 'Added back on Snapchat!', createdAt: new Date(now - 4 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 2, activityLevel: 'high', lastActivityAt: new Date(now - 4 * 60 * 60 * 1000), totalInteractions: 9, engagementScore: 33 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 11 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 4 * 60 * 60 * 1000), metadata: {},
          },
          // Initial Snap Sent/Received
          {
            id: 'sample-12',
            platforms: { 
              instagram: { username: 'lucas_miller', displayName: 'Lucas' },
              snapchat: { username: 'lucas_m' },
            },
            displayName: 'Lucas',
            stage: FunnelStage.INITIAL_SNAP_SENT_RECEIVED,
            tags: ['initial-snap'],
            notes: [{ id: 'n12', text: 'Sent first snap, they responded', createdAt: new Date(now - 3 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 3 * 60 * 60 * 1000), totalInteractions: 10, engagementScore: 38 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 12 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 3 * 60 * 60 * 1000), metadata: {},
          },
          // Snapchat Conversation
          {
            id: 'sample-13',
            platforms: { 
              instagram: { username: 'mason_wilson', displayName: 'Mason' },
              snapchat: { username: 'mason_w' },
            },
            displayName: 'Mason',
            stage: FunnelStage.SNAPCHAT_CONVERSATION,
            tags: ['active', 'conversation'],
            notes: [
              { id: 'n13a', text: 'Regular snapchat conversation', createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000) },
              { id: 'n13b', text: 'Very engaged, snaps daily', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) },
            ],
            engagement: { replySpeed: 3, activityLevel: 'high', lastActivityAt: new Date(now - 2 * 60 * 60 * 1000), totalInteractions: 15, engagementScore: 42 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 13 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 2 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-14',
            platforms: { 
              instagram: { username: 'logan_anderson', displayName: 'Logan' },
              snapchat: { username: 'logan_a' },
            },
            displayName: 'Logan',
            stage: FunnelStage.SNAPCHAT_CONVERSATION,
            tags: ['conversation'],
            notes: [{ id: 'n14', text: 'Good conversation flow', createdAt: new Date(now - 5 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 5, activityLevel: 'medium', lastActivityAt: new Date(now - 5 * 60 * 60 * 1000), totalInteractions: 8, engagementScore: 42 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 14 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 5 * 60 * 60 * 1000), metadata: {},
          },
          // Heated Snapchat Conversation
          {
            id: 'sample-15',
            platforms: { 
              instagram: { username: 'carter_thomas', displayName: 'Carter' },
              snapchat: { username: 'carter_t' },
            },
            displayName: 'Carter',
            stage: FunnelStage.HEATED_SNAPCHAT_CONVERSATION,
            tags: ['heated', 'high-interest'],
            notes: [
              { id: 'n15a', text: 'Conversation getting very heated', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) },
              { id: 'n15b', text: 'Showing strong interest', createdAt: new Date(now - 12 * 60 * 60 * 1000) },
            ],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 30 * 60 * 1000), totalInteractions: 20, engagementScore: 53 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 15 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 30 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-16',
            platforms: { 
              instagram: { username: 'owen_martinez', displayName: 'Owen' },
              snapchat: { username: 'owen_m' },
            },
            displayName: 'Owen',
            stage: FunnelStage.HEATED_SNAPCHAT_CONVERSATION,
            tags: ['heated'],
            notes: [{ id: 'n16', text: 'Very engaged conversation', createdAt: new Date(now - 3 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 2, activityLevel: 'high', lastActivityAt: new Date(now - 3 * 60 * 60 * 1000), totalInteractions: 18, engagementScore: 53 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 16 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 3 * 60 * 60 * 1000), metadata: {},
          },
          // The Ask
          {
            id: 'sample-17',
            platforms: { 
              instagram: { username: 'connor_white', displayName: 'Connor' },
              snapchat: { username: 'connor_w' },
            },
            displayName: 'Connor',
            stage: FunnelStage.THE_ASK,
            tags: ['ask-sent'],
            notes: [{ id: 'n17', text: 'Made the ask, waiting for response', createdAt: new Date(now - 4 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 4 * 60 * 60 * 1000), totalInteractions: 22, engagementScore: 58 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 17 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 4 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-18',
            platforms: { 
              instagram: { username: 'aiden_jackson', displayName: 'Aiden' },
              snapchat: { username: 'aiden_j' },
            },
            displayName: 'Aiden',
            stage: FunnelStage.THE_ASK,
            tags: ['ask-sent'],
            notes: [{ id: 'n18', text: 'Sent the ask yesterday', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 3, activityLevel: 'high', lastActivityAt: new Date(now - 1 * 24 * 60 * 60 * 1000), totalInteractions: 19, engagementScore: 58 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 18 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 1 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Ask Delivered
          {
            id: 'sample-19',
            platforms: { 
              instagram: { username: 'hunter_harris', displayName: 'Hunter' },
              snapchat: { username: 'hunter_h' },
            },
            displayName: 'Hunter',
            stage: FunnelStage.ASK_DELIVERED,
            tags: ['ask-delivered'],
            notes: [{ id: 'n19', text: 'Ask delivered, they accepted', createdAt: new Date(now - 2 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 2 * 60 * 60 * 1000), totalInteractions: 25, engagementScore: 62 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 19 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 2 * 60 * 60 * 1000), metadata: {},
          },
          // Paid
          {
            id: 'sample-20',
            platforms: { 
              instagram: { username: 'grayson_moore', displayName: 'Grayson' },
              snapchat: { username: 'grayson_m' },
            },
            displayName: 'Grayson',
            stage: FunnelStage.PAID,
            tags: ['paid', 'buyer'],
            notes: [{ id: 'n20', text: 'Payment received!', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 2, activityLevel: 'high', lastActivityAt: new Date(now - 1 * 24 * 60 * 60 * 1000), totalInteractions: 30, engagementScore: 70 },
            monetization: { 
              offers: [], 
              payments: [{ id: 'p1', amount: 150, currency: 'USD', method: 'Venmo', receivedAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }], 
              totalRevenue: 150, 
              averageOfferValue: 150 
            },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 20 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 1 * 24 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-21',
            platforms: { 
              instagram: { username: 'colton_lewis', displayName: 'Colton' },
              snapchat: { username: 'colton_l' },
            },
            displayName: 'Colton',
            stage: FunnelStage.PAID,
            tags: ['paid', 'buyer'],
            notes: [{ id: 'n21', text: 'Paid 2 days ago', createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 3, activityLevel: 'high', lastActivityAt: new Date(now - 2 * 24 * 60 * 60 * 1000), totalInteractions: 28, engagementScore: 70 },
            monetization: { 
              offers: [], 
              payments: [{ id: 'p2', amount: 200, currency: 'USD', method: 'Cash App', receivedAt: new Date(now - 2 * 24 * 60 * 60 * 1000) }], 
              totalRevenue: 200, 
              averageOfferValue: 200 
            },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 21 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 2 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Returning Customer
          {
            id: 'sample-22',
            platforms: { 
              instagram: { username: 'brayden_walker', displayName: 'Brayden' },
              snapchat: { username: 'brayden_w' },
            },
            displayName: 'Brayden',
            stage: FunnelStage.RETURNING_CUSTOMER,
            tags: ['returning', 'buyer'],
            notes: [
              { id: 'n22a', text: 'First purchase last month', createdAt: new Date(now - 30 * 24 * 60 * 60 * 1000) },
              { id: 'n22b', text: 'Came back for more', createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000) },
            ],
            engagement: { replySpeed: 2, activityLevel: 'high', lastActivityAt: new Date(now - 1 * 24 * 60 * 60 * 1000), totalInteractions: 35, engagementScore: 65 },
            monetization: { 
              offers: [], 
              payments: [
                { id: 'p3', amount: 180, currency: 'USD', method: 'PayPal', receivedAt: new Date(now - 30 * 24 * 60 * 60 * 1000) },
                { id: 'p4', amount: 220, currency: 'USD', method: 'Venmo', receivedAt: new Date(now - 5 * 24 * 60 * 60 * 1000) },
              ], 
              totalRevenue: 400, 
              averageOfferValue: 200 
            },
            reminders: [], priority: 'high', isHighValue: true, isDormant: false,
            createdAt: new Date(now - 35 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 1 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Satisfied Customer
          {
            id: 'sample-23',
            platforms: { 
              instagram: { username: 'cameron_young', displayName: 'Cameron' },
              snapchat: { username: 'cameron_y' },
            },
            displayName: 'Cameron',
            stage: FunnelStage.SATISFIED_CUSTOMER,
            tags: ['satisfied', 'completed'],
            notes: [{ id: 'n23', text: 'Service delivered, very satisfied', createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 4, activityLevel: 'medium', lastActivityAt: new Date(now - 3 * 24 * 60 * 60 * 1000), totalInteractions: 32, engagementScore: 45 },
            monetization: { 
              offers: [], 
              payments: [{ id: 'p5', amount: 175, currency: 'USD', method: 'Cash App', receivedAt: new Date(now - 7 * 24 * 60 * 60 * 1000) }], 
              totalRevenue: 175, 
              averageOfferValue: 175 
            },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 25 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 3 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Dormant
          {
            id: 'sample-24',
            platforms: { instagram: { username: 'dylan_garcia', displayName: 'Dylan' } },
            displayName: 'Dylan',
            stage: FunnelStage.DORMANT,
            tags: ['dormant'],
            notes: [{ id: 'n24', text: 'No activity for 3 weeks', createdAt: new Date(now - 20 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 48, activityLevel: 'low', lastActivityAt: new Date(now - 20 * 24 * 60 * 60 * 1000), totalInteractions: 3, engagementScore: -5 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'low', isHighValue: false, isDormant: true,
            createdAt: new Date(now - 25 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 20 * 24 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-25',
            platforms: { instagram: { username: 'zachary_clark', displayName: 'Zachary' } },
            displayName: 'Zachary',
            stage: FunnelStage.DORMANT,
            tags: ['dormant'],
            notes: [{ id: 'n25', text: 'Stopped responding', createdAt: new Date(now - 18 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 72, activityLevel: 'low', lastActivityAt: new Date(now - 18 * 24 * 60 * 60 * 1000), totalInteractions: 2, engagementScore: -5 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'low', isHighValue: false, isDormant: true,
            createdAt: new Date(now - 22 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 18 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Instagram Followed
          {
            id: 'sample-26',
            platforms: { instagram: { username: 'kevin_rodriguez', displayName: 'Kevin' } },
            displayName: 'Kevin',
            stage: FunnelStage.INSTAGRAM_FOLLOWED,
            tags: ['new'],
            notes: [{ id: 'n26', text: 'New follower from story', createdAt: new Date(now - 3 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 0, activityLevel: 'low', lastActivityAt: new Date(now - 3 * 60 * 60 * 1000), totalInteractions: 0, engagementScore: 0 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 3 * 60 * 60 * 1000), updatedAt: new Date(), metadata: {},
          },
          {
            id: 'sample-27',
            platforms: { instagram: { username: 'sebastian_taylor', displayName: 'Sebastian' } },
            displayName: 'Sebastian',
            stage: FunnelStage.INSTAGRAM_FOLLOWED,
            tags: ['new'],
            notes: [{ id: 'n27', text: 'Followed after seeing post', createdAt: new Date(now - 6 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 0, activityLevel: 'low', lastActivityAt: new Date(now - 6 * 60 * 60 * 1000), totalInteractions: 0, engagementScore: 0 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 6 * 60 * 60 * 1000), updatedAt: new Date(), metadata: {},
          },
          {
            id: 'sample-28',
            platforms: { instagram: { username: 'isaac_martinez', displayName: 'Isaac' } },
            displayName: 'Isaac',
            stage: FunnelStage.INSTAGRAM_FOLLOWED,
            tags: ['new'],
            notes: [{ id: 'n28', text: 'Just followed', createdAt: new Date(now - 12 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 0, activityLevel: 'low', lastActivityAt: new Date(now - 12 * 60 * 60 * 1000), totalInteractions: 0, engagementScore: 0 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 12 * 60 * 60 * 1000), updatedAt: new Date(), metadata: {},
          },
          // Additional Instagram Followed Back
          {
            id: 'sample-29',
            platforms: { instagram: { username: 'nathan_robinson', displayName: 'Nathan' } },
            displayName: 'Nathan',
            stage: FunnelStage.INSTAGRAM_FOLLOWED_BACK,
            tags: ['followed-back'],
            notes: [{ id: 'n29', text: 'Followed back this morning', createdAt: new Date(now - 4 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 0, activityLevel: 'low', lastActivityAt: new Date(now - 4 * 60 * 60 * 1000), totalInteractions: 1, engagementScore: 3 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 4 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-30',
            platforms: { instagram: { username: 'caleb_mitchell', displayName: 'Caleb' } },
            displayName: 'Caleb',
            stage: FunnelStage.INSTAGRAM_FOLLOWED_BACK,
            tags: ['followed-back'],
            notes: [{ id: 'n30', text: 'Followed back yesterday', createdAt: new Date(now - 20 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 0, activityLevel: 'low', lastActivityAt: new Date(now - 20 * 60 * 60 * 1000), totalInteractions: 1, engagementScore: 3 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 20 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Instagram DM Sent
          {
            id: 'sample-31',
            platforms: { instagram: { username: 'luke_williams', displayName: 'Luke' } },
            displayName: 'Luke',
            stage: FunnelStage.INSTAGRAM_DM_SENT,
            tags: ['dm-sent'],
            notes: [{ id: 'n31', text: 'Sent DM 2 hours ago', createdAt: new Date(now - 2 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 24, activityLevel: 'low', lastActivityAt: new Date(now - 2 * 60 * 60 * 1000), totalInteractions: 1, engagementScore: 5 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 2 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-32',
            platforms: { instagram: { username: 'jackson_davis', displayName: 'Jackson' } },
            displayName: 'Jackson',
            stage: FunnelStage.INSTAGRAM_DM_SENT,
            tags: ['dm-sent'],
            notes: [{ id: 'n32', text: 'DM sent, no response yet', createdAt: new Date(now - 18 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 24, activityLevel: 'low', lastActivityAt: new Date(now - 18 * 60 * 60 * 1000), totalInteractions: 1, engagementScore: 5 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 18 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Engaged In DM Conversation
          {
            id: 'sample-33',
            platforms: { instagram: { username: 'gavin_thompson', displayName: 'Gavin' } },
            displayName: 'Gavin',
            stage: FunnelStage.ENGAGED_IN_DM_CONVERSATION,
            tags: ['engaged'],
            notes: [
              { id: 'n33a', text: 'Started conversation', createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000) },
              { id: 'n33b', text: 'Asking good questions', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) },
            ],
            engagement: { replySpeed: 4, activityLevel: 'medium', lastActivityAt: new Date(now - 6 * 60 * 60 * 1000), totalInteractions: 6, engagementScore: 13 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 6 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 6 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-34',
            platforms: { instagram: { username: 'landon_white', displayName: 'Landon' } },
            displayName: 'Landon',
            stage: FunnelStage.ENGAGED_IN_DM_CONVERSATION,
            tags: ['engaged', 'responsive'],
            notes: [{ id: 'n34', text: 'Very responsive in DMs', createdAt: new Date(now - 10 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 2, activityLevel: 'high', lastActivityAt: new Date(now - 10 * 60 * 60 * 1000), totalInteractions: 9, engagementScore: 18 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 10 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Asked for the Snap
          {
            id: 'sample-35',
            platforms: { instagram: { username: 'cooper_adams', displayName: 'Cooper' } },
            displayName: 'Cooper',
            stage: FunnelStage.ASKED_FOR_THE_SNAP,
            tags: ['snap-requested'],
            notes: [{ id: 'n35', text: 'Asked for Snapchat, waiting', createdAt: new Date(now - 8 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 3, activityLevel: 'high', lastActivityAt: new Date(now - 8 * 60 * 60 * 1000), totalInteractions: 7, engagementScore: 22 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 8 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 8 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Snapchat Added
          {
            id: 'sample-36',
            platforms: { 
              instagram: { username: 'xavier_king', displayName: 'Xavier' },
              snapchat: { username: 'xavier_k' },
            },
            displayName: 'Xavier',
            stage: FunnelStage.SNAPCHAT_ADDED,
            tags: ['snapchat-added'],
            notes: [{ id: 'n36', text: 'Added on Snapchat', createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 7, activityLevel: 'medium', lastActivityAt: new Date(now - 3 * 24 * 60 * 60 * 1000), totalInteractions: 5, engagementScore: 27 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 9 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 3 * 24 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-37',
            platforms: { 
              instagram: { username: 'jaxon_scott', displayName: 'Jaxon' },
              snapchat: { username: 'jaxon_s' },
            },
            displayName: 'Jaxon',
            stage: FunnelStage.SNAPCHAT_ADDED,
            tags: ['snapchat-added'],
            notes: [{ id: 'n37', text: 'Added yesterday', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 9, activityLevel: 'medium', lastActivityAt: new Date(now - 1 * 24 * 60 * 60 * 1000), totalInteractions: 3, engagementScore: 27 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 1 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Snapchat Added Back
          {
            id: 'sample-38',
            platforms: { 
              instagram: { username: 'parker_green', displayName: 'Parker' },
              snapchat: { username: 'parker_g' },
            },
            displayName: 'Parker',
            stage: FunnelStage.SNAPCHAT_ADDED_BACK,
            tags: ['snapchat-added-back'],
            notes: [{ id: 'n38', text: 'Added back!', createdAt: new Date(now - 5 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 5 * 60 * 60 * 1000), totalInteractions: 10, engagementScore: 33 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 11 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 5 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Initial Snap Sent/Received
          {
            id: 'sample-39',
            platforms: { 
              instagram: { username: 'riley_baker', displayName: 'Riley' },
              snapchat: { username: 'riley_b' },
            },
            displayName: 'Riley',
            stage: FunnelStage.INITIAL_SNAP_SENT_RECEIVED,
            tags: ['initial-snap'],
            notes: [{ id: 'n39', text: 'First snap exchange', createdAt: new Date(now - 4 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 2, activityLevel: 'high', lastActivityAt: new Date(now - 4 * 60 * 60 * 1000), totalInteractions: 11, engagementScore: 38 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 12 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 4 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-40',
            platforms: { 
              instagram: { username: 'tristan_nelson', displayName: 'Tristan' },
              snapchat: { username: 'tristan_n' },
            },
            displayName: 'Tristan',
            stage: FunnelStage.INITIAL_SNAP_SENT_RECEIVED,
            tags: ['initial-snap'],
            notes: [{ id: 'n40', text: 'Snapped back and forth', createdAt: new Date(now - 6 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 6 * 60 * 60 * 1000), totalInteractions: 12, engagementScore: 38 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 13 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 6 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Snapchat Conversation
          {
            id: 'sample-41',
            platforms: { 
              instagram: { username: 'wyatt_hill', displayName: 'Wyatt' },
              snapchat: { username: 'wyatt_h' },
            },
            displayName: 'Wyatt',
            stage: FunnelStage.SNAPCHAT_CONVERSATION,
            tags: ['active', 'conversation'],
            notes: [
              { id: 'n41a', text: 'Regular snaps', createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000) },
              { id: 'n41b', text: 'Good rapport', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) },
            ],
            engagement: { replySpeed: 4, activityLevel: 'high', lastActivityAt: new Date(now - 3 * 60 * 60 * 1000), totalInteractions: 16, engagementScore: 42 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 13 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 3 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-42',
            platforms: { 
              instagram: { username: 'blake_campbell', displayName: 'Blake' },
              snapchat: { username: 'blake_c' },
            },
            displayName: 'Blake',
            stage: FunnelStage.SNAPCHAT_CONVERSATION,
            tags: ['conversation'],
            notes: [{ id: 'n42', text: 'Steady conversation', createdAt: new Date(now - 6 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 6, activityLevel: 'medium', lastActivityAt: new Date(now - 6 * 60 * 60 * 1000), totalInteractions: 9, engagementScore: 42 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 14 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 6 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Heated Snapchat Conversation
          {
            id: 'sample-43',
            platforms: { 
              instagram: { username: 'hayden_roberts', displayName: 'Hayden' },
              snapchat: { username: 'hayden_r' },
            },
            displayName: 'Hayden',
            stage: FunnelStage.HEATED_SNAPCHAT_CONVERSATION,
            tags: ['heated', 'high-interest'],
            notes: [
              { id: 'n43a', text: 'Conversation heating up', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) },
              { id: 'n43b', text: 'Very interested', createdAt: new Date(now - 14 * 60 * 60 * 1000) },
            ],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 45 * 60 * 1000), totalInteractions: 21, engagementScore: 53 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 15 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 45 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-44',
            platforms: { 
              instagram: { username: 'bennett_ward', displayName: 'Bennett' },
              snapchat: { username: 'bennett_w' },
            },
            displayName: 'Bennett',
            stage: FunnelStage.HEATED_SNAPCHAT_CONVERSATION,
            tags: ['heated'],
            notes: [{ id: 'n44', text: 'Very engaged, snaps constantly', createdAt: new Date(now - 4 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 4 * 60 * 60 * 1000), totalInteractions: 19, engagementScore: 53 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 16 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 4 * 60 * 60 * 1000), metadata: {},
          },
          // Additional The Ask
          {
            id: 'sample-45',
            platforms: { 
              instagram: { username: 'weston_turner', displayName: 'Weston' },
              snapchat: { username: 'weston_t' },
            },
            displayName: 'Weston',
            stage: FunnelStage.THE_ASK,
            tags: ['ask-sent'],
            notes: [{ id: 'n45', text: 'Made the ask this morning', createdAt: new Date(now - 5 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 5 * 60 * 60 * 1000), totalInteractions: 23, engagementScore: 58 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 17 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 5 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-46',
            platforms: { 
              instagram: { username: 'axel_phillips', displayName: 'Axel' },
              snapchat: { username: 'axel_p' },
            },
            displayName: 'Axel',
            stage: FunnelStage.THE_ASK,
            tags: ['ask-sent'],
            notes: [{ id: 'n46', text: 'Sent ask, waiting', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 2, activityLevel: 'high', lastActivityAt: new Date(now - 1 * 24 * 60 * 60 * 1000), totalInteractions: 20, engagementScore: 58 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 18 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 1 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Ask Delivered
          {
            id: 'sample-47',
            platforms: { 
              instagram: { username: 'brody_evans', displayName: 'Brody' },
              snapchat: { username: 'brody_e' },
            },
            displayName: 'Brody',
            stage: FunnelStage.ASK_DELIVERED,
            tags: ['ask-delivered'],
            notes: [{ id: 'n47', text: 'Ask delivered and accepted!', createdAt: new Date(now - 3 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 3 * 60 * 60 * 1000), totalInteractions: 26, engagementScore: 62 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 19 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 3 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-48',
            platforms: { 
              instagram: { username: 'colt_edwards', displayName: 'Colt' },
              snapchat: { username: 'colt_e' },
            },
            displayName: 'Colt',
            stage: FunnelStage.ASK_DELIVERED,
            tags: ['ask-delivered'],
            notes: [{ id: 'n48', text: 'They said yes!', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 1, activityLevel: 'high', lastActivityAt: new Date(now - 1 * 24 * 60 * 60 * 1000), totalInteractions: 24, engagementScore: 62 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 20 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 1 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Paid
          {
            id: 'sample-49',
            platforms: { 
              instagram: { username: 'knox_wood', displayName: 'Knox' },
              snapchat: { username: 'knox_w' },
            },
            displayName: 'Knox',
            stage: FunnelStage.PAID,
            tags: ['paid', 'buyer'],
            notes: [{ id: 'n49', text: 'Payment received via Venmo', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 2, activityLevel: 'high', lastActivityAt: new Date(now - 1 * 24 * 60 * 60 * 1000), totalInteractions: 29, engagementScore: 70 },
            monetization: { 
              offers: [], 
              payments: [{ id: 'p6', amount: 180, currency: 'USD', method: 'Venmo', receivedAt: new Date(now - 1 * 24 * 60 * 60 * 1000) }], 
              totalRevenue: 180, 
              averageOfferValue: 180 
            },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 21 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 1 * 24 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-50',
            platforms: { 
              instagram: { username: 'kaden_richards', displayName: 'Kaden' },
              snapchat: { username: 'kaden_r' },
            },
            displayName: 'Kaden',
            stage: FunnelStage.PAID,
            tags: ['paid', 'buyer'],
            notes: [{ id: 'n50', text: 'Paid 3 days ago', createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 4, activityLevel: 'high', lastActivityAt: new Date(now - 3 * 24 * 60 * 60 * 1000), totalInteractions: 27, engagementScore: 70 },
            monetization: { 
              offers: [], 
              payments: [{ id: 'p7', amount: 250, currency: 'USD', method: 'Cash App', receivedAt: new Date(now - 3 * 24 * 60 * 60 * 1000) }], 
              totalRevenue: 250, 
              averageOfferValue: 250 
            },
            reminders: [], priority: 'high', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 22 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 3 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Returning Customer
          {
            id: 'sample-51',
            platforms: { 
              instagram: { username: 'ryker_coleman', displayName: 'Ryker' },
              snapchat: { username: 'ryker_c' },
            },
            displayName: 'Ryker',
            stage: FunnelStage.RETURNING_CUSTOMER,
            tags: ['returning', 'buyer'],
            notes: [
              { id: 'n51a', text: 'First purchase last month', createdAt: new Date(now - 28 * 24 * 60 * 60 * 1000) },
              { id: 'n51b', text: 'Back for more', createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000) },
            ],
            engagement: { replySpeed: 3, activityLevel: 'high', lastActivityAt: new Date(now - 2 * 24 * 60 * 60 * 1000), totalInteractions: 36, engagementScore: 65 },
            monetization: { 
              offers: [], 
              payments: [
                { id: 'p8', amount: 190, currency: 'USD', method: 'PayPal', receivedAt: new Date(now - 28 * 24 * 60 * 60 * 1000) },
                { id: 'p9', amount: 210, currency: 'USD', method: 'Venmo', receivedAt: new Date(now - 4 * 24 * 60 * 60 * 1000) },
              ], 
              totalRevenue: 400, 
              averageOfferValue: 200 
            },
            reminders: [], priority: 'high', isHighValue: true, isDormant: false,
            createdAt: new Date(now - 35 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 2 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Satisfied Customer
          {
            id: 'sample-52',
            platforms: { 
              instagram: { username: 'holden_stewart', displayName: 'Holden' },
              snapchat: { username: 'holden_s' },
            },
            displayName: 'Holden',
            stage: FunnelStage.SATISFIED_CUSTOMER,
            tags: ['satisfied', 'completed'],
            notes: [{ id: 'n52', text: 'Service completed, happy customer', createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 5, activityLevel: 'medium', lastActivityAt: new Date(now - 4 * 24 * 60 * 60 * 1000), totalInteractions: 31, engagementScore: 45 },
            monetization: { 
              offers: [], 
              payments: [{ id: 'p10', amount: 165, currency: 'USD', method: 'Cash App', receivedAt: new Date(now - 8 * 24 * 60 * 60 * 1000) }], 
              totalRevenue: 165, 
              averageOfferValue: 165 
            },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 25 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 4 * 24 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-53',
            platforms: { 
              instagram: { username: 'kyson_morris', displayName: 'Kyson' },
              snapchat: { username: 'kyson_m' },
            },
            displayName: 'Kyson',
            stage: FunnelStage.SATISFIED_CUSTOMER,
            tags: ['satisfied', 'completed'],
            notes: [{ id: 'n53', text: 'Very satisfied with service', createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 6, activityLevel: 'medium', lastActivityAt: new Date(now - 5 * 24 * 60 * 60 * 1000), totalInteractions: 30, engagementScore: 45 },
            monetization: { 
              offers: [], 
              payments: [{ id: 'p11', amount: 195, currency: 'USD', method: 'PayPal', receivedAt: new Date(now - 9 * 24 * 60 * 60 * 1000) }], 
              totalRevenue: 195, 
              averageOfferValue: 195 
            },
            reminders: [], priority: 'medium', isHighValue: false, isDormant: false,
            createdAt: new Date(now - 26 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 5 * 24 * 60 * 60 * 1000), metadata: {},
          },
          // Additional Dormant
          {
            id: 'sample-54',
            platforms: { instagram: { username: 'paxton_rogers', displayName: 'Paxton' } },
            displayName: 'Paxton',
            stage: FunnelStage.DORMANT,
            tags: ['dormant'],
            notes: [{ id: 'n54', text: 'No response for 4 weeks', createdAt: new Date(now - 25 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 96, activityLevel: 'low', lastActivityAt: new Date(now - 25 * 24 * 60 * 60 * 1000), totalInteractions: 1, engagementScore: -5 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'low', isHighValue: false, isDormant: true,
            createdAt: new Date(now - 26 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 25 * 24 * 60 * 60 * 1000), metadata: {},
          },
          {
            id: 'sample-55',
            platforms: { instagram: { username: 'zane_peterson', displayName: 'Zane' } },
            displayName: 'Zane',
            stage: FunnelStage.DORMANT,
            tags: ['dormant'],
            notes: [{ id: 'n55', text: 'Ghosted after initial contact', createdAt: new Date(now - 22 * 24 * 60 * 60 * 1000) }],
            engagement: { replySpeed: 120, activityLevel: 'low', lastActivityAt: new Date(now - 22 * 24 * 60 * 60 * 1000), totalInteractions: 1, engagementScore: -5 },
            monetization: { offers: [], payments: [], totalRevenue: 0, averageOfferValue: 0 },
            reminders: [], priority: 'low', isHighValue: false, isDormant: true,
            createdAt: new Date(now - 23 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastContactAt: new Date(now - 22 * 24 * 60 * 60 * 1000), metadata: {},
          },
        ] as Lead[];
        
        const calculatedLeads = sampleLeads.map((lead: Lead) => updateLeadCalculations(lead));
        
    set((state: LeadStore) => ({ ...state, leads: calculatedLeads }));
  },
}));

