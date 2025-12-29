'use client';

import React from 'react';
import { useLeadStore } from '@/lib/stores/leadStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight, Users, TrendingUp, Bell } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { initializeWithSampleData } = useLeadStore();

  const handleGetStarted = () => {
    initializeWithSampleData();
    onComplete();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-12 px-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Track your leads, grow your business</h1>
            <p className="text-gray-500 text-lg">
              Manage and monetize your social media leads across platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Organize Leads</h3>
              <p className="text-sm text-gray-500">
                Track conversations across Instagram and Snapchat
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Monetize</h3>
              <p className="text-sm text-gray-500">
                Know when leads are ready for offers
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
                <Bell className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold mb-2">Stay on Top</h3>
              <p className="text-sm text-gray-500">
                Get reminders for important follow-ups
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleGetStarted} size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={onComplete} size="lg">
              Skip Tutorial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


