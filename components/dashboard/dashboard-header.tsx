import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({ title, description, actions, className }: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row justify-between items-start sm:items-center',
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="mt-4 sm:mt-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
}
