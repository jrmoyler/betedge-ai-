'use client';
import { cn } from '@/lib/utils';
import { SPORTS, type SportKey, SPORT_KEYS } from '@/lib/sports-config';

interface SportFilterProps {
  selected: SportKey | 'all';
  onSelect: (sport: SportKey | 'all') => void;
  className?: string;
}

export function SportFilter({ selected, onSelect, className }: SportFilterProps) {
  return (
    <div className={cn('flex items-center gap-1.5 overflow-x-auto pb-1', className)}>
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'h-10 whitespace-nowrap rounded-md px-4 text-sm font-semibold transition-colors',
          selected === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'border border-border bg-secondary text-muted-foreground hover:text-foreground',
        )}
      >
        All
      </button>
      {SPORT_KEYS.map((key: SportKey) => {
        const sport = SPORTS[key];
        if (!sport) return null;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              'h-10 whitespace-nowrap rounded-md px-4 text-sm font-semibold transition-colors',
              selected === key
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {sport.shortName}
          </button>
        );
      })}
    </div>
  );
}
