'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function LetterPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Adin&apos;s Letter</h1>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-relaxed">
          <div className="space-y-4">
            <p className="text-foreground">
              Welcome to your CRM. This tool is designed to help you manage your relationships, not replace them.
            </p>

            <div className="space-y-3">
              <h2 className="font-semibold text-base mt-6">How to Use This Tool</h2>
              
              <p>
                Each card represents a person you&apos;re building a relationship with. They&apos;re not just leads or prospects—they&apos;re real people moving through your funnel. The stages you see represent the natural progression of how relationships develop, from that first Instagram follow all the way through to satisfied customers.
              </p>

              <p>
                Your board shows where everyone is in their journey with you. Drag cards between stages as relationships evolve. There&apos;s no rush. People move at their own pace, and that&apos;s okay.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-base mt-6">Nurturing Your Relationships</h2>
              
              <p>
                The most important thing to remember: <strong>relationships take time</strong>. Don&apos;t rush people through stages. Just because someone followed you back doesn&apos;t mean they&apos;re ready for your Snapchat. Just because you&apos;re having a heated conversation doesn&apos;t mean it&apos;s time to make &quot;The Ask.&quot;
              </p>

              <p>
                Pay attention to the engagement score. It&apos;s not just a number—it reflects how responsive someone is, how active your conversations are, and where they are in their journey. Use it as a guide, not a rule. Someone with a lower score might just need more time, not less attention.
              </p>

              <p>
                Use notes to remember the little things. What did they mention they liked? What questions did they ask? These details matter. They show you&apos;re paying attention, and they help you personalize your approach when the time is right.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-base mt-6">Taking Your Time</h2>
              
              <p>
                This isn&apos;t a race. There&apos;s no prize for moving someone through stages quickly. In fact, rushing usually backfires. People can sense when they&apos;re being pushed, and it creates pressure that kills genuine connection.
              </p>

              <p>
                Let conversations breathe. If someone&apos;s in &quot;Engaged In DM Conversation,&quot; let them stay there until they&apos;re genuinely ready to move forward. If they&apos;re in &quot;Snapchat Conversation,&quot; enjoy that phase. Don&apos;t jump to &quot;The Ask&quot; just because you can.
              </p>

              <p>
                The reminders you see are suggestions, not commands. They&apos;re there to help you remember to follow up, not to pressure you into action. Use them as gentle nudges, not urgent deadlines.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-base mt-6">Building Real Connections</h2>
              
              <p>
                Every person on your board is a potential long-term relationship. Some will become customers. Some won&apos;t. That&apos;s normal. Focus on being genuine, being helpful, and being patient. The right people will move forward when they&apos;re ready.
              </p>

              <p>
                Remember: you&apos;re not just selling something. You&apos;re building trust. You&apos;re creating connections. You&apos;re showing people that you value them as individuals, not just as potential revenue. That&apos;s what makes this work.
              </p>

              <p>
                Take care of your relationships, and they&apos;ll take care of you. Move people through stages when it feels natural, not when a system tells you to. Trust your instincts. You know your audience better than any tool ever could.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-base mt-6">Final Thoughts</h2>
              
              <p>
                This CRM is here to support you, not control you. Use it to stay organized, to remember details, to track progress. But don&apos;t let it replace your judgment. You know when someone is ready. You know when to push forward and when to wait.
              </p>

              <p>
                Be patient. Be genuine. Be present. The relationships you build this way will be stronger, more valuable, and more sustainable than anything rushed or forced.
              </p>

              <p className="mt-6 text-gray-500">
                Take your time. Your people are worth it.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <div className="space-y-2">
                <p className="font-medium">-Adin Zander</p>
                <p className="text-sm text-gray-500">a.k.a. STEPxBROTHER</p>
                <p className="text-sm">
                  <a 
                    href="https://x.com/stepxbrother" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    x.com/stepxbrother
                  </a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
