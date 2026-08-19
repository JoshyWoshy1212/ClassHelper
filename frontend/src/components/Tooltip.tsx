'use client';

import React from 'react';

interface TooltipProps {
  content?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ children }: TooltipProps) {
  return <>{children}</>;
}
