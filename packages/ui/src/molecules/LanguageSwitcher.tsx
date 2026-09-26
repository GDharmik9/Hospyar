import React from 'react';
import { cn } from '../lib/utils';

export interface LanguageSwitcherProps {
  currentLocale: string;
  onLocaleChange: (locale: 'en-US' | 'ar-SA') => void;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  onLocaleChange,
  className
}) => {
  const isArabic = currentLocale.startsWith('ar');

  return (
    <div
      className={cn(
        'inline-flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 shadow-xs',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onLocaleChange('en-US')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer',
          !isArabic
            ? 'bg-slate-800 text-white shadow-xs'
            : 'text-slate-400 hover:text-slate-200'
        )}
      >
        <span>EN</span>
        <span className="text-[10px] text-slate-500 font-normal">LTR</span>
      </button>

      <button
        type="button"
        onClick={() => onLocaleChange('ar-SA')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer font-arabic',
          isArabic
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-400 hover:text-slate-200'
        )}
      >
        <span>العربية</span>
        <span className="text-[10px] text-emerald-200 font-normal">RTL</span>
      </button>
    </div>
  );
};
