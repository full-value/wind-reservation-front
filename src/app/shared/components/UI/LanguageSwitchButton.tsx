'use client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const locales = ['en', 'fr']; // Supported locales
const defaultLocale = 'en'; // Default locale

type Props = { 
  label?: boolean; // Label text for the input field 
};

const LocaleSwitcher = ({ label }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get the current locale from the URL
  const currentLocale = pathname.split('/')[1] || defaultLocale;

  // Handle the locale change and prevent full page reload using shallow routing
  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale; 
    const newPathname = segments.join('/');
    const queryString = searchParams.toString() ? `?${searchParams}` : '';

    // Use shallow routing to change the locale without reloading the page
    // router.replace(`${newPathname}${queryString}`, undefined, { shallow: true });
    router.push(`${newPathname}${queryString}`, undefined, { shallow: true });
  };

  return (
    <div className={`flex justify-center gap-0 p-[6px] bg-[#1E3151] rounded-[52px] ${!label && "absolute top-[30px] right-[30px]"}`}>
      {label
        ? locales.map((lng) => (
            <div
              key={lng}
              className={`flex justify-center items-center bg-cover bg-no-repeat bg-center w-[115px] h-[52px] gap-2 rounded-full cursor-pointer p-0 ${lng === currentLocale && 'bg-[#BDD2EFE5]'}`}
            >
              <div
                style={{
                  backgroundImage: `url('/assets/icons/flag-${lng}.svg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                className="w-8 h-8"
                onClick={() => handleLocaleChange(lng)}
              ></div>
              <p
                className={`font-normal text-[14px] leading-[16px] tracking-[-0.05em] ${lng === currentLocale ? "text-white" : "text-[#091428]"}`}
                onClick={() => handleLocaleChange(lng)}
              >
                {lng === "en" ? "English" : "French"}
              </p>
            </div>
          ))
        : locales.map((lng) => (
            <div
              key={lng}
              className={`flex justify-center items-center bg-cover bg-no-repeat bg-center w-6 h-6 rounded-full cursor-pointer p-0 ${lng === currentLocale && 'bg-[#BDD2EFE5]'}`}
            >
              <div
                style={{
                  backgroundImage: `url('/assets/icons/flag-${lng}.svg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                className="w-4 h-4"
                onClick={() => handleLocaleChange(lng)}
              ></div>
            </div>
          ))}
    </div>
  );
};

export default LocaleSwitcher;
