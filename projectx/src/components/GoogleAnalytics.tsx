'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    if (typeof window.gtag === 'function') {
      window.gtag('config', measurementId, {
        page_path: url,
        send_page_view: true,
        debug_mode: true,
        cookie_domain: 'gooli.pt',
        cookie_flags: 'SameSite=None;Secure',
        transport_url: 'https://www.google-analytics.com',
        transport_type: 'beacon'
      });
    }
  }, [pathname, searchParams, measurementId, mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Google Analytics Base Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      
      {/* Google Analytics Configuration */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
            send_page_view: true,
            debug_mode: true,
            cookie_domain: 'gooli.pt',
            cookie_flags: 'SameSite=None;Secure',
            transport_url: 'https://www.google-analytics.com',
            transport_type: 'beacon'
          });
        `}
      </Script>
    </>
  );
} 