import { useState, useEffect } from 'react';

export function useRTL(initialLocale: string = 'en-US') {
  const [locale, setLocale] = useState(initialLocale);
  const isRTL = locale.startsWith('ar');
  const direction = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [direction, locale]);

  return {
    locale,
    setLocale,
    isRTL,
    direction
  };
}
