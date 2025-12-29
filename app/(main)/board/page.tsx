'use client';

import React from 'react';
import { BoardView } from '@/components/board/BoardView';

export default function BoardPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-hidden">
        <BoardView />
      </div>
    </div>
  );
}

