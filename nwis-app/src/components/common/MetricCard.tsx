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
        return 'border-amber-500/20 hover:border-amber-500/40';
      case 'red':
        return 'border-red-500/25 hover:border-red-500/45';
      case 'emerald':
        return 'border-emerald-500/20 hover:border-emerald-500/40';
      default:
        return 'border-white/[0.06] hover:border-blue-500/30';
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-900/70 backdrop-blur-md p-4 border transition-all duration-200 ${getGlow()}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {badge && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {badge}
          </span>
        )}
        {Icon && !badge && (
          <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold font-mono tracking-tight text-slate-100">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          {subtitle && <span className="truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`font-mono text-[11px] font-medium ${
                trend.positive ? 'text-emerald-400' : 'text-red-400'
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
