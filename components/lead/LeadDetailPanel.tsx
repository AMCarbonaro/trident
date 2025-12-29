'use client';

import React, { useEffect } from 'react';
import { X, Instagram, MessageCircle, Copy, Check } from 'lucide-react';
import { useLeadStore } from '@/lib/stores/leadStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { FunnelStage } from '@/lib/types/lead';
import { STAGE_LABELS } from '@/lib/constants/stages';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatTimeAgo, formatDateTime } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';

export function LeadDetailPanel() {
  const { selectedLeadId, getLeadById, updateLead, setSelectedLeadId } = useLeadStore();
  const { isDetailPanelOpen, closeDetailPanel } = useUIStore();
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const lead = selectedLeadId ? getLeadById(selectedLeadId) : null;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDetailPanelOpen) {
        closeDetailPanel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDetailPanelOpen, closeDetailPanel]);

  if (!lead || !isDetailPanelOpen) return null;

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUpdate = async (updates: Partial<typeof lead>) => {
    try {
      await updateLead(lead.id, updates);
    } catch (error) {
      console.error('Failed to update lead:', error);
      // Error handling can be improved with toast notifications
    }
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleUpdate({ stage: e.target.value as FunnelStage });
  };

  const handleNoteAdd = (text: string) => {
    if (text.trim()) {
      const newNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: text.trim(),
        createdAt: new Date(),
      };
      handleUpdate({ notes: [...lead.notes, newNote] });
    }
  };

  const handleNoteDelete = (noteId: string) => {
    handleUpdate({ notes: lead.notes.filter(n => n.id !== noteId) });
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !lead.tags.includes(tag.trim())) {
      handleUpdate({ tags: [...lead.tags, tag.trim()] });
    }
  };

  const handleTagRemove = (tag: string) => {
    handleUpdate({ tags: lead.tags.filter(t => t !== tag) });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeDetailPanel}
      />
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto shadow-lg animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-detail-title"
      >
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 id="lead-detail-title" className="text-lg font-semibold">{lead.displayName}</h2>
          <Button variant="ghost" size="sm" onClick={closeDetailPanel} aria-label="Close lead details">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Identity Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4">Identity</h3>
              <div className="space-y-3">
                {lead.platforms.instagram && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-500" />
                      <span className="text-sm">@{lead.platforms.instagram.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(lead.platforms.instagram!.username, 'instagram')}
                    >
                      {copiedField === 'instagram' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
                {lead.platforms.snapchat && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{lead.platforms.snapchat.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(lead.platforms.snapchat!.username, 'snapchat')}
                    >
                      {copiedField === 'snapchat' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4">Notes</h3>
              <div className="space-y-3 mb-4">
                {lead.notes.length > 0 ? (
                  [...lead.notes].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((note) => (
                    <div key={note.id} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{note.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDateTime(note.createdAt)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNoteDelete(note.id)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                        aria-label="Delete note"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No notes yet</p>
                )}
              </div>
              <Input
                placeholder="Add a note (press Enter to save)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleNoteAdd(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {lead.tags.map((tag) => (
                  <Badge key={tag} variant="default" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTagAdd(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4">Engagement</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500">Score</span>
                    <span className="text-sm font-medium">{lead.engagement.engagementScore}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all',
                        lead.engagement.engagementScore >= 70 ? 'bg-green-500' :
                        lead.engagement.engagementScore >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
                      )}
                      style={{ width: `${lead.engagement.engagementScore}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reply Speed</span>
                  <span>{lead.engagement.replySpeed}h avg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Activity Level</span>
                  <Badge variant="default">{lead.engagement.activityLevel}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Activity</span>
                  <span>{formatTimeAgo(lead.engagement.lastActivityAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Interactions</span>
                  <span>{lead.engagement.totalInteractions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage Selector */}
          <Card>
            <CardContent className="pt-6">
              <Select
                label="Stage"
                value={lead.stage}
                onChange={handleStageChange}
              >
                {Object.entries(STAGE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </CardContent>
          </Card>

          {/* Reminders */}
          {lead.reminders.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sm mb-4">Reminders</h3>
                <div className="space-y-2">
                  {lead.reminders
                    .filter(r => !r.completedAt)
                    .map((reminder) => (
                      <div key={reminder.id} className="flex items-start gap-2 p-2 bg-muted rounded">
                        <input
                          type="checkbox"
                          checked={!!reminder.completedAt}
                          onChange={(e) => {
                            const updatedReminders = lead.reminders.map(r =>
                              r.id === reminder.id
                                ? { ...r, completedAt: e.target.checked ? new Date() : undefined }
                                : r
                            );
                            handleUpdate({ reminders: updatedReminders });
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="text-sm">{reminder.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {formatTimeAgo(reminder.dueAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

