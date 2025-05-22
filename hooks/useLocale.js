import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const supportedLocales = ['en', 'pt'];

const useLocale = () => {
  const path = useRouter().asPath;
  const [locale, setLocale] = useState(supportedLocales[0]);

  useEffect(() => {
    const pathLocale = path.split('/')[1];
    if (supportedLocales.includes(pathLocale)) {
      setLocale(pathLocale);
    } else {
      setLocale(supportedLocales[0]);
    }
  }, [path]);

  return { locale, setLocale };
}

export default useLocale;
