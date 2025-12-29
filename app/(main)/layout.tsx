'use client';

import React from 'react';
import { LeadDetailPanel } from '@/components/lead/LeadDetailPanel';
import { ToastContainer } from '@/components/ui/Toast';
import { useToastStore } from '@/lib/stores/toastStore';
import { KeyboardShortcuts } from '@/components/layout/KeyboardShortcuts';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Navigation } from '@/components/layout/Navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toasts, dismissToast } = useToastStore();

  return (
    <ErrorBoundary>
      <KeyboardShortcuts />
      <Navigation />
      {children}
      <LeadDetailPanel />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ErrorBoundary>
  );
}
