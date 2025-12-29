'use client';

import React from 'react';
import { Lead } from '@/lib/types/lead';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { Instagram, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils/cn';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export const LeadCard = React.memo(function LeadCard({ lead, onClick }: LeadCardProps) {
  const getPriorityColor = () => {
    switch (lead.priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-gray-400';
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const timeAgo = formatDistanceToNow(lead.engagement.lastActivityAt, { addSuffix: true });

  return (
    <Card
      hover
      onClick={onClick}
      className={cn(
        'mb-3 p-3 cursor-pointer transition-all',
        lead.isDormant && 'opacity-60'
      )}
      role="button"
      tabIndex={0}
      aria-label={`Lead card for ${lead.displayName}, stage: ${lead.stage}, priority: ${lead.priority}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={cn('w-2 h-2 rounded-full flex-shrink-0', getPriorityColor())} />
          <h3 className="font-medium text-sm text-foreground truncate">
            {lead.displayName}
          </h3>
        </div>
      </div>

      {/* Platform Icons */}
      <div className="flex items-center gap-2 mb-2">
        {lead.platforms.instagram && (
          <Tooltip content={`Instagram: @${lead.platforms.instagram.username}`}>
            <Instagram className="h-4 w-4 text-pink-500" />
          </Tooltip>
        )}
        {lead.platforms.snapchat && (
          <Tooltip content={`Snapchat: ${lead.platforms.snapchat.username}`}>
            <MessageCircle className="h-4 w-4 text-yellow-500" />
          </Tooltip>
        )}
      </div>

      {/* Engagement Score Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Engagement</span>
          <span className="text-xs font-medium text-foreground">
            {lead.engagement.engagementScore}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all', getEngagementColor(lead.engagement.engagementScore))}
            style={{ width: `${lead.engagement.engagementScore}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      {lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {lead.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="default" className="text-xs">
              {tag}
            </Badge>
          ))}
          {lead.tags.length > 2 && (
            <Badge variant="default" className="text-xs">
              +{lead.tags.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Last Activity */}
      <div className="text-xs text-gray-500">
        {timeAgo}
      </div>
    </Card>
  );
});

