'use client';

import React from 'react';
import { useLeadStore } from '@/lib/stores/leadStore';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { leads, deleteLead } = useLeadStore();

  const handleExport = () => {
    const dataStr = JSON.stringify(leads, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crm-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete all leads? This cannot be undone.')) {
      try {
        await Promise.all(leads.map(lead => deleteLead(lead.id)));
      } catch (error) {
        console.error('Failed to delete leads:', error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your CRM data and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Data Management</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm mb-1">Export Data</h3>
              <p className="text-sm text-gray-500">
                Download all your leads as a JSON file
              </p>
            </div>
            <Button variant="secondary" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm mb-1">Clear All Data</h3>
                <p className="text-sm text-gray-500">
                  Permanently delete all leads. This cannot be undone.
                </p>
              </div>
              <Button variant="secondary" onClick={handleClearAll} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">About</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Content Creator CRM v0.1.0
          </p>
          <p className="text-sm text-gray-500 mt-2">
            A professional CRM for managing and monetizing social media leads.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


