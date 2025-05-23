import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supportedLocales } from '../hooks/useLocale';

export default function HomeRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Get browser languages, e.g. ['en-US', 'en', 'fr']
    const browserLangs =
      typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : [];
    // Find the first supported locale that matches browser preference
    const matchedLocale = browserLangs
      .map(lang => lang.split('-')[0]) // Use only the language code
      .find(lang => supportedLocales.includes(lang));
    // Fallback to the first supported locale if no match
    const localeToUse = matchedLocale || supportedLocales[0];
    router.replace(`/${localeToUse}`);
  }, [router]);
  return <div />;
}
