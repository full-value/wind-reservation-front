// Example of a LocaleSwitcher component
'use client';

import { useRouter } from 'next/navigation';

const LocaleSwitcher = () => {
  const router = useRouter();

  const changeLocale = (locale: string) => {
    // Set the locale in the cookie
    document.cookie = `locale=${locale}; path=/; max-age=31536000`; // Expires in 1 year
    
    // Redirect to the current page with the new locale
    router.refresh(); // This forces a page reload to reflect the new locale
  };

  return (
    <div>
      <button onClick={() => changeLocale('en')}>English</button>
      <button onClick={() => changeLocale('fr')}>Français</button>
    </div>
  );
};

export default LocaleSwitcher;
