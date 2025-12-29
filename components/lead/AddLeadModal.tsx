'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLeadStore } from '@/lib/stores/leadStore';
import { FunnelStage, Note } from '@/lib/types/lead';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStage?: FunnelStage;
}

export function AddLeadModal({ isOpen, onClose, defaultStage }: AddLeadModalProps) {
  const { addLead } = useLeadStore();
  const [formData, setFormData] = useState({
    displayName: '',
    instagramUsername: '',
    snapchatUsername: '',
    notes: '',
    stage: defaultStage || FunnelStage.INSTAGRAM_FOLLOWED,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Update stage when defaultStage changes (when opening modal from different columns)
  useEffect(() => {
    if (isOpen && defaultStage) {
      setFormData(prev => ({ ...prev, stage: defaultStage }));
    }
  }, [isOpen, defaultStage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const platforms: any = {};
    if (formData.instagramUsername) {
      platforms.instagram = {
        username: formData.instagramUsername,
      };
    }
    if (formData.snapchatUsername) {
      platforms.snapchat = {
        username: formData.snapchatUsername,
      };
    }

    const now = new Date();
    const initialNotes: Note[] = formData.notes.trim() ? [{
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: formData.notes.trim(),
      createdAt: now,
    }] : [];
    
    try {
      // Use defaultStage if provided, otherwise use formData.stage
      const stageToUse = defaultStage || formData.stage;
      await addLead({
        platforms,
        displayName: formData.displayName || 'New Lead',
        stage: stageToUse,
        tags: [],
        notes: initialNotes,
        engagement: {
          replySpeed: 12,
          activityLevel: 'medium',
          lastActivityAt: now,
          totalInteractions: 0,
          engagementScore: 50,
        },
        monetization: {
          offers: [],
          payments: [],
          totalRevenue: 0,
          averageOfferValue: 0,
        },
        reminders: [],
        priority: 'medium',
        isHighValue: false,
        isDormant: false,
        lastContactAt: now,
        metadata: {},
      });

      setFormData({
        displayName: '',
        instagramUsername: '',
        snapchatUsername: '',
        notes: '',
        stage: defaultStage || FunnelStage.INSTAGRAM_FOLLOWED,
      });
      setError('');
      onClose();
    } catch (error) {
      console.error('Failed to add lead:', error);
      setError(error instanceof Error ? error.message : 'Failed to create lead');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Lead" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            {error}
          </div>
        )}
        <Input
          label="Display Name"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          placeholder="Enter name"
          required
          disabled={isLoading}
        />
        <Input
          label="Instagram Username"
          value={formData.instagramUsername}
          onChange={(e) => setFormData({ ...formData, instagramUsername: e.target.value })}
          placeholder="@username"
          disabled={isLoading}
        />
        <Input
          label="Snapchat Username"
          value={formData.snapchatUsername}
          onChange={(e) => setFormData({ ...formData, snapchatUsername: e.target.value })}
          placeholder="username"
          disabled={isLoading}
        />
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any notes about this lead..."
          rows={3}
          disabled={isLoading}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Add Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

