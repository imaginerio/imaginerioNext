import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supportedLocales } from '../hooks/useLocale';

export default function HomeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${supportedLocales[0]}`);
  }, [router]);
  return null;
}
