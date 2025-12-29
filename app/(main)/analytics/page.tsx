'use client';

import React from 'react';
import { useLeadStore } from '@/lib/stores/leadStore';
import { FunnelStage } from '@/lib/types/lead';
import { DEFAULT_STAGES, STAGE_LABELS } from '@/lib/constants/stages';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AnalyticsPage() {
  const { leads } = useLeadStore();

  // Calculate leads by stage
  const leadsByStage = React.useMemo(() => {
    const counts: Record<FunnelStage, number> = {} as any;
    DEFAULT_STAGES.forEach(stage => {
      counts[stage] = 0;
    });
    leads.forEach(lead => {
      counts[lead.stage] = (counts[lead.stage] || 0) + 1;
    });
    return counts;
  }, [leads]);

  // Calculate conversion rates
  const conversionRates = React.useMemo(() => {
    const rates: Record<string, number> = {};
    
    // Instagram Followed → Paid conversion
    const instagramFollowed = leadsByStage[FunnelStage.INSTAGRAM_FOLLOWED] || 0;
    const paid = leadsByStage[FunnelStage.PAID] || 0;
    rates['followed-to-paid'] = instagramFollowed > 0 ? (paid / instagramFollowed) * 100 : 0;

    // Heated Conversation → Ask Delivered conversion
    const heatedConversation = leadsByStage[FunnelStage.HEATED_SNAPCHAT_CONVERSATION] || 0;
    const askDelivered = leadsByStage[FunnelStage.ASK_DELIVERED] || 0;
    rates['heated-to-ask'] = heatedConversation > 0 ? (askDelivered / heatedConversation) * 100 : 0;

    return rates;
  }, [leadsByStage]);

  // Calculate average time to first payment
  const averageTimeToPayment = React.useMemo(() => {
    // Only count leads that actually have payments
    const leadsWithPayments = leads.filter(lead => 
      lead.monetization.payments.length > 0
    );
    
    if (leadsWithPayments.length === 0) return 0;

    const totalDays = leadsWithPayments.reduce((sum, lead) => {
      const firstPayment = lead.monetization.payments[0];
      const days = (firstPayment.receivedAt.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);

    return totalDays / leadsWithPayments.length;
  }, [leads]);

  // Top performing stages (only show stages with leads)
  const topStages = React.useMemo(() => {
    return Object.entries(leadsByStage)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([stage, count]) => ({ stage: stage as FunnelStage, count }));
  }, [leadsByStage]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-500 text-sm">Overview of your leads and performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500 mb-1">Total Leads</div>
            <div className="text-2xl font-bold">{leads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500 mb-1">Avg Time to Payment</div>
            <div className="text-2xl font-bold">
              {averageTimeToPayment > 0 ? `${averageTimeToPayment.toFixed(1)} days` : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads by Stage */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Leads by Stage</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DEFAULT_STAGES.map((stage) => {
              const count = leadsByStage[stage] || 0;
              const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
              
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{STAGE_LABELS[stage]}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{count}</span>
                      <Badge variant="default">{percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rates */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Conversion Rates</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Instagram Followed → Paid</span>
                <span className="text-sm font-medium">
                  {conversionRates['followed-to-paid']?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${conversionRates['followed-to-paid'] || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Heated Conversation → Ask Delivered</span>
                <span className="text-sm font-medium">
                  {conversionRates['heated-to-ask']?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${conversionRates['heated-to-ask'] || 0}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Stages */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Top Stages</h2>
        </CardHeader>
        <CardContent>
          {topStages.length > 0 ? (
            <div className="space-y-2">
              {topStages.map(({ stage, count }, index) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                    <span className="text-sm">{STAGE_LABELS[stage]}</span>
                  </div>
                  <Badge variant="default">{count} {count === 1 ? 'lead' : 'leads'}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No leads yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

