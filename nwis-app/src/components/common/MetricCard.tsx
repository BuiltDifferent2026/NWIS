import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  highlightColor?: 'blue' | 'amber' | 'red' | 'emerald';
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  highlightColor = 'blue',
  badge
}) => {
  const getGlow = () => {
    switch (highlightColor) {
      case 'amber':
        return 'border-amber-200 dark:border-amber-800/60 hover:border-amber-500/50 hover:shadow-amber-500/5';
      case 'red':
        return 'border-rose-200 dark:border-rose-800/60 hover:border-rose-500/50 hover:shadow-rose-500/5';
      case 'emerald':
        return 'border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-500/50 hover:shadow-emerald-500/5';
      default:
        return 'border-neutral-200 dark:border-neutral-800 hover:border-amber-500/40';
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-[#12151c] p-4.5 border shadow-xs transition-all duration-200 ${getGlow()}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          {title}
        </span>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold">
            {badge}
          </span>
        )}
        {Icon && !badge && (
          <div className="p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="text-2xl font-black font-mono tracking-tight text-neutral-950 dark:text-white">
          {value}
        </span>
        {unit && <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">{unit}</span>}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
          {subtitle && <span className="truncate font-medium">{subtitle}</span>}
          {trend && (
            <span
              className={`font-mono text-[11px] font-bold ${
                trend.positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
