'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Users, TrendingUp, MessageSquare, DollarSign, Zap, GripVertical, BarChart3, FileText, Instagram, Smartphone, CheckCircle2, Clock, Target, Heart, Sparkles, Star, ChevronRight, Terminal, Code, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const stages = [
    { name: 'Instagram Followed', color: 'bg-gray-50 dark:bg-gray-900', leads: ['Tyler', 'Jake', 'Kevin', 'Sebastian', 'Isaac'] },
    { name: 'Instagram Followed Back', color: 'bg-gray-100 dark:bg-gray-800', leads: ['Ryan', 'Nathan', 'Caleb'] },
    { name: 'Instagram DM Sent', color: 'bg-blue-50 dark:bg-blue-950', leads: ['Marcus', 'David', 'Luke', 'Jackson'] },
    { name: 'Engaged In DM Conversation', color: 'bg-blue-100 dark:bg-blue-900', leads: ['Chris', 'Brandon', 'Gavin', 'Landon'] },
    { name: 'Asked for the Snap', color: 'bg-blue-200 dark:bg-blue-700', leads: ['Alex', 'Cooper'] },
    { name: 'Snapchat Added', color: 'bg-indigo-100 dark:bg-indigo-900', leads: ['Jordan', 'Noah', 'Xavier', 'Jaxon'] },
    { name: 'Snapchat Added Back', color: 'bg-purple-50 dark:bg-purple-950', leads: ['Ethan', 'Parker'] },
    { name: 'Initial Snap Sent/Received', color: 'bg-purple-100 dark:bg-purple-900', leads: ['Lucas', 'Riley', 'Tristan'] },
    { name: 'Snapchat Conversation', color: 'bg-pink-50 dark:bg-pink-950', leads: ['Mason', 'Logan', 'Wyatt', 'Blake'] },
    { name: 'Heated Snapchat Conversation', color: 'bg-pink-100 dark:bg-pink-900', leads: ['Carter', 'Owen', 'Hayden', 'Bennett'] },
    { name: 'The Ask', color: 'bg-yellow-50 dark:bg-yellow-950', leads: ['Connor', 'Aiden', 'Weston', 'Axel'] },
    { name: 'Ask Delivered', color: 'bg-orange-50 dark:bg-orange-950', leads: ['Hunter', 'Brody', 'Colt'] },
    { name: 'Paid', color: 'bg-green-50 dark:bg-green-950', leads: ['Grayson', 'Colton', 'Knox', 'Kaden'] },
    { name: 'Returning Customer', color: 'bg-emerald-50 dark:bg-emerald-950', leads: ['Brayden', 'Ryker'] },
    { name: 'Satisfied Customer', color: 'bg-teal-50 dark:bg-teal-950', leads: ['Cameron', 'Holden', 'Kyson'] },
    { name: 'Dormant', color: 'bg-slate-50 dark:bg-slate-900', leads: ['Dylan', 'Zachary', 'Paxton', 'Zane'] },
  ];

  return (
    <div className="min-h-screen bg-black text-red-400 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Glitch effect overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 via-transparent to-red-900/5"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center">
            {/* Terminal-style badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded border border-red-500/50 bg-red-950/30 text-red-400 text-sm font-mono mb-8 animate-pulse">
              <Terminal className="h-4 w-4" />
              <span>&gt; INITIALIZING TRIDENT CRM...</span>
            </div>

            {/* Main Heading with glitch effect */}
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 font-mono">
              <span className="block text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                trident
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-bold text-red-400 mt-4 font-mono">
                &gt; CRM SYSTEM for Content Creators
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-red-300 mb-6 max-w-4xl mx-auto leading-tight font-mono">
              <span className="text-red-500">&gt;</span> From Instagram to snapchat to satisfied customer—<br className="hidden md:block" />
              <span className="text-red-400">track every relationship</span> in one terminal
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-red-400/80 mb-10 max-w-3xl mx-auto leading-relaxed font-mono">
              <span className="text-red-500">&gt;</span> No rifraf. No complexity. Just drag, drop, and watch your pipeline execute.<br />
              Built for creators who value genuine connections over quick conversions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-10 py-7 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white border-2 border-red-500 font-mono shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] transition-all">
                  &gt; GET STARTED
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="text-lg px-10 py-7 flex items-center gap-2 border-2 border-red-500 text-red-400 hover:bg-red-950/30 font-mono bg-transparent">
                  &gt; LOG IN
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-red-950/20 border border-red-500/30 rounded p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold text-red-500 mb-1 font-mono">16</div>
                <div className="text-sm text-red-400/80 font-mono">FUNNEL STAGES</div>
              </div>
              <div className="bg-red-950/20 border border-red-500/30 rounded p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold text-red-500 mb-1 font-mono">100%</div>
                <div className="text-sm text-red-400/80 font-mono">VISUAL PIPELINE</div>
              </div>
              <div className="bg-red-950/20 border border-red-500/30 rounded p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold text-red-500 mb-1 font-mono">∞</div>
                <div className="text-sm text-red-400/80 font-mono">UNLIMITED LEADS</div>
              </div>
              <div className="bg-red-950/20 border border-red-500/30 rounded p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold text-red-500 mb-1 font-mono">24/7</div>
                <div className="text-sm text-red-400/80 font-mono">SYSTEM ACTIVE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Showcase - Board Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-red-400 mb-4 font-mono">
            &gt; PIPELINE VISUALIZATION
          </h2>
          <p className="text-xl text-red-400/70 max-w-2xl mx-auto font-mono">
            See every lead, every stage, every interaction—all in one terminal
          </p>
        </div>
        
        {/* App-style board preview with normal aesthetics */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Board View</h3>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {stages.map((stage, idx) => (
                <div key={idx} className={`flex-shrink-0 w-64 flex flex-col h-[500px] ${stage.color} rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm`}>
                  {/* Column Header */}
                  <div className="p-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate">{stage.name}</h3>
                        <span className="text-xs text-gray-500 mt-1 block">{stage.leads.length} {stage.leads.length === 1 ? 'lead' : 'leads'}</span>
                      </div>
                    </div>
                  </div>
                  {/* Column Content */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 min-h-0">
                    {stage.leads.map((lead, leadIdx) => {
                      const engagementScores = [45, 52, 68, 75, 82, 88, 92];
                      const score = engagementScores[leadIdx % engagementScores.length];
                      const priorityColors = {
                        high: 'border-l-4 border-l-red-500',
                        medium: 'border-l-4 border-l-yellow-500',
                        low: 'border-l-4 border-l-gray-400',
                      };
                      const priority = leadIdx % 3 === 0 ? 'high' : leadIdx % 3 === 1 ? 'medium' : 'low';
                      return (
                        <div 
                          key={leadIdx} 
                          className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer ${priorityColors[priority as keyof typeof priorityColors]}`}
                        >
                          <div className="font-medium text-sm text-foreground">{lead}</div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-gray-500">Engagement: {score}%</div>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${score > 70 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
              <GripVertical className="h-4 w-4" />
              Drag cards between stages to move leads through your funnel
            </p>
          </div>
        </div>
      </div>

      {/* The Complete Journey */}
      <div className="bg-gradient-to-r from-red-950/20 via-red-900/10 to-red-950/20 py-20 relative z-10 border-y border-red-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-red-400 mb-4 font-mono">
              &gt; FROM FOLLOW TO PAYMENT
            </h2>
            <p className="text-xl text-red-400/70 max-w-2xl mx-auto font-mono">
              Track the complete journey with 16 custom stages
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-8 text-center bg-black/50 border-2 border-red-500/30 hover:border-red-500 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <div className="inline-flex p-4 bg-red-950/30 border border-red-500/30 rounded-full mb-4">
                <Instagram className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-red-300 font-mono">INSTAGRAM</h3>
              <p className="text-sm text-red-400/70 leading-relaxed font-mono">Follow → Follow Back → DM → Conversation</p>
            </Card>
            
            <Card className="p-8 text-center bg-black/50 border-2 border-red-500/30 hover:border-red-500 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <div className="inline-flex p-4 bg-red-950/30 border border-red-500/30 rounded-full mb-4">
                <Smartphone className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-red-300 font-mono">SNAPCHAT</h3>
              <p className="text-sm text-red-400/70 leading-relaxed font-mono">Add → Add Back → Snap → Conversation → Heated</p>
            </Card>
            
            <Card className="p-8 text-center bg-black/50 border-2 border-red-500/30 hover:border-red-500 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <div className="inline-flex p-4 bg-red-950/30 border border-red-500/30 rounded-full mb-4">
                <Target className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-red-300 font-mono">THE ASK</h3>
              <p className="text-sm text-red-400/70 leading-relaxed font-mono">Make The Ask → Deliver → Get Paid</p>
            </Card>
            
            <Card className="p-8 text-center bg-black/50 border-2 border-red-500/30 hover:border-red-500 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <div className="inline-flex p-4 bg-red-950/30 border border-red-500/30 rounded-full mb-4">
                <CheckCircle2 className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-red-300 font-mono">SUCCESS</h3>
              <p className="text-sm text-red-400/70 leading-relaxed font-mono">Paid → Returning → Satisfied</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-red-400 mb-4 font-mono">
            &gt; SYSTEM CAPABILITIES
          </h2>
          <p className="text-xl text-red-400/70 max-w-2xl mx-auto font-mono">
            Powerful features designed for content creators
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-8 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all border-2 border-red-500/30 hover:border-red-500 bg-black/50 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl flex-shrink-0 group-hover:border-red-500">
                <GripVertical className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-300 mb-2 font-mono">DRAG & DROP BOARD</h3>
                <p className="text-red-400/70 leading-relaxed font-mono text-sm">
                  Move leads through your funnel with a simple drag. No forms, no clicks—just drag and drop. See your entire pipeline at a glance.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all border-2 border-red-500/30 hover:border-red-500 bg-black/50 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl flex-shrink-0 group-hover:border-red-500">
                <MessageSquare className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-300 mb-2 font-mono">ENGAGEMENT INTELLIGENCE</h3>
                <p className="text-red-400/70 leading-relaxed font-mono text-sm">
                  Track reply speed, activity levels, and engagement scores. Know who&apos;s ready to move forward and who needs more nurturing.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all border-2 border-red-500/30 hover:border-red-500 bg-black/50 group">
            <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl flex-shrink-0 mb-4 group-hover:border-red-500">
              <BarChart3 className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-red-300 mb-2 font-mono">ANALYTICS DASHBOARD</h3>
              <p className="text-red-400/70 leading-relaxed font-mono text-sm">
                See conversion rates, average time to payment, top stages, and more. Understand your funnel performance with actionable insights.
              </p>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all border-2 border-red-500/30 hover:border-red-500 bg-black/50 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl flex-shrink-0 group-hover:border-red-500">
                <FileText className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-300 mb-2 font-mono">CHRONOLOGICAL NOTES</h3>
                <p className="text-red-400/70 leading-relaxed font-mono text-sm">
                  Add multiple notes per lead, saved in chronological order. Remember every detail, every conversation, every preference.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all border-2 border-red-500/30 hover:border-red-500 bg-black/50 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl flex-shrink-0 group-hover:border-red-500">
                <Clock className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-300 mb-2 font-mono">SMART REMINDERS</h3>
                <p className="text-red-400/70 leading-relaxed font-mono text-sm">
                  Get gentle reminders for follow-ups. Know when to ask for Snapchat, when to send the first snap, when to make The Ask.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all border-2 border-red-500/30 hover:border-red-500 bg-black/50 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl flex-shrink-0 group-hover:border-red-500">
                <DollarSign className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-300 mb-2 font-mono">PAYMENT TRACKING</h3>
                <p className="text-red-400/70 leading-relaxed font-mono text-sm">
                  Track payments, revenue, and customer lifetime value. See who&apos;s paid, who&apos;s a returning customer, and who&apos;s satisfied.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Why It Matters */}
      <div className="relative py-32 overflow-hidden border-y border-red-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-black to-red-950/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex p-5 bg-red-950/30 border border-red-500/30 rounded-2xl mb-10 backdrop-blur-sm">
              <Heart className="h-14 w-14 text-red-400" fill="currentColor" />
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 text-red-400 leading-tight font-mono">
              &gt; RELATIONSHIPS,<br />
              <span className="text-red-500">NOT TRANSACTIONS</span>
            </h2>
            
            <div className="max-w-3xl mx-auto mb-10">
              <p className="text-xl md:text-2xl text-red-300 leading-relaxed mb-6 font-mono">
                trident is built on the belief that the best business comes from{' '}
                <span className="text-red-400 font-bold">genuine connections</span>.
              </p>
              <p className="text-lg md:text-xl text-red-400/80 leading-relaxed font-mono">
                We don&apos;t rush you through stages or pressure you to convert. We give you the tools to 
                nurture relationships at their own pace, because that&apos;s how you{' '}
                <span className="text-red-300 font-bold">build something real</span>.
              </p>
            </div>
            
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-red-950/30 border border-red-500/30 rounded-full backdrop-blur-sm">
              <Star className="h-5 w-5 text-red-400" fill="currentColor" />
              <p className="text-lg md:text-xl text-red-300 font-semibold font-mono">
                &gt; Take your time. Your people are worth it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-red-600/20 rounded-3xl blur-2xl"></div>
          
          <Card className="relative p-12 md:p-20 text-center bg-gradient-to-br from-red-950/50 via-black to-red-950/50 border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNlZjQ0NDQiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-600/20 border border-red-500/50 rounded-full mb-8 backdrop-blur-sm">
                <Code className="h-4 w-4 text-red-400" />
                <span className="text-sm font-semibold text-red-300 font-mono">EXECUTE DEMO</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight font-mono text-red-300">
                &gt; READY TO TRANSFORM<br />
                <span className="text-red-400">YOUR LEAD MANAGEMENT?</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-red-300/80 mb-12 max-w-3xl mx-auto leading-relaxed font-mono">
                See trident in action with our live demo. Explore the board, check out the analytics, 
                and see how easy it is to manage your relationships.
              </p>
              
              <Link href="/signup">
                <Button size="lg" className="text-lg md:text-xl px-12 py-8 bg-red-600 hover:bg-red-700 text-white flex items-center gap-3 mx-auto shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:shadow-[0_0_40px_rgba(239,68,68,0.8)] transition-all font-mono border-2 border-red-500">
                  &gt; GET STARTED
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </Link>
              
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-red-400/70 font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-400" />
                  <span>&gt; No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-400" />
                  <span>&gt; Instant access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-400" />
                  <span>&gt; Full demo available</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-red-500/20 bg-black/50 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-red-400 mb-4 font-mono">
              trident
            </h3>
            <p className="text-red-400/60 font-mono">
              &gt; Built for content creators who value genuine relationships
            </p>
          </div>
          <div className="text-center text-sm text-red-400/40 font-mono">
            <p>&gt; © 2024 trident. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
