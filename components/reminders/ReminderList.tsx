'use client';

import React from 'react';
import { useLeadStore } from '@/lib/stores/leadStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatTimeAgo } from '@/lib/utils/date';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ReminderList() {
  const { leads, updateLead, setSelectedLeadId } = useLeadStore();
  const { openDetailPanel } = useUIStore();

  // Get all active reminders from all leads
  const allReminders = React.useMemo(() => {
    const reminders: Array<{
      id: string;
      leadId: string;
      leadName: string;
      message: string;
      dueAt: Date;
      priority: 'high' | 'medium' | 'low';
      type: string;
    }> = [];

    leads.forEach(lead => {
      lead.reminders
        .filter(r => !r.completedAt)
        .forEach(reminder => {
          reminders.push({
            id: reminder.id,
            leadId: lead.id,
            leadName: lead.displayName,
            message: reminder.message,
            dueAt: reminder.dueAt,
            priority: reminder.priority,
            type: reminder.type,
          });
        });
    });

    // Sort by priority and due date
    return reminders.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.dueAt.getTime() - b.dueAt.getTime();
    });
  }, [leads]);

  const handleComplete = (leadId: string, reminderId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updatedReminders = lead.reminders.map(r =>
      r.id === reminderId
        ? { ...r, completedAt: new Date() }
        : r
    );
    updateLead(leadId, { reminders: updatedReminders });
  };

  const handleViewLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    openDetailPanel();
  };

  if (allReminders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No reminders</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold text-sm mb-4">Reminders ({allReminders.length})</h3>
        <div className="space-y-2">
          {allReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-start gap-3 p-3 bg-muted rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <input
                type="checkbox"
                onChange={() => handleComplete(reminder.leadId, reminder.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={
                      reminder.priority === 'high' ? 'danger' :
                      reminder.priority === 'medium' ? 'warning' : 'default'
                    }
                    className="text-xs"
                  >
                    {reminder.priority}
                  </Badge>
                  <span className="text-xs text-gray-500">{reminder.type}</span>
                </div>
                <p className="text-sm font-medium mb-1">{reminder.message}</p>
                <p className="text-xs text-gray-500 mb-2">
                  Due: {formatTimeAgo(reminder.dueAt)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewLead(reminder.leadId)}
                  className="text-xs h-7"
                >
                  View Lead
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


