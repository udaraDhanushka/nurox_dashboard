import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
    label: string;
  };
  indicator?: {
    status: 'active' | 'warning' | 'success' | 'error';
    label: string;
  };
  progress?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  indicator,
  progress,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2 mb-1">
          <h2 className="text-3xl font-bold leading-none tracking-tight">{value}</h2>
        </div>

        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                'text-xs font-medium inline-flex items-center',
                trend.positive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.positive ? (
                <ArrowUpIcon className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 mr-1" />
              )}
              {trend.value}
            </span>
            <span className="text-xs text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}

        {indicator && (
          <div className="mt-2 flex items-center">
            <span
              className={cn(
                'flex h-2 w-2 rounded-full mr-2',
                indicator.status === 'active' && 'bg-blue-500 animate-pulse',
                indicator.status === 'warning' && 'bg-yellow-500',
                indicator.status === 'success' && 'bg-green-500',
                indicator.status === 'error' && 'bg-red-500'
              )}
            />
            <span className="text-xs text-muted-foreground">{indicator.label}</span>
          </div>
        )}

        {progress && (
          <div className="mt-2 space-y-1">
            <Progress value={progress.value} className="h-1" />
            <p className="text-xs text-muted-foreground">{progress.label}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
