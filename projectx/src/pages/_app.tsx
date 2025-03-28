import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import GoogleAnalytics from '@/components/SEO/GoogleAnalytics'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      <Component {...pageProps} />
      <Toaster position="top-center" />
    </SessionProvider>
  )
} 