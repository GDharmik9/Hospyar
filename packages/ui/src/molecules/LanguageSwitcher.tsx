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
        'inline-flex items-center bg-[#061D20] border border-[#4F7C82]/50 rounded-lg p-0.5 shadow-2xs',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onLocaleChange('en-US')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer',
          !isArabic
            ? 'bg-[#4F7C82] text-white shadow-xs'
            : 'text-[#93B1B5] hover:text-white'
        )}
      >
        <span>EN</span>
        <span className="text-[10px] text-[#B8E3E9] font-normal">LTR</span>
      </button>

      <button
        type="button"
        onClick={() => onLocaleChange('ar-SA')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer font-arabic',
          isArabic
            ? 'bg-[#4F7C82] text-white shadow-xs'
            : 'text-[#93B1B5] hover:text-white'
        )}
      >
        <span>العربية</span>
        <span className="text-[10px] text-[#B8E3E9] font-normal">RTL</span>
      </button>
    </div>
  );
};
