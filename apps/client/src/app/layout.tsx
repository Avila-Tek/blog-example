import './globals.css';
import { ReactQueryProvider } from '@/context/react-query';
import {
  type TAnalyticsOption,
  type TAnalyticsProviderProps,
} from '@repo/ui/analytics';
import {
  type TFeateFlagConfig,
  type TFeatureFlagContextProviderProps,
} from '@repo/ui/feature-flags';
import type { Metadata } from 'next';
import type { SessionProviderProps } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import dynamic from 'next/dynamic';
import localFont from 'next/font/local';

const FeatureFlagContextProvider = dynamic<TFeatureFlagContextProviderProps>(
  () =>
    import('@repo/ui/feature-flags').then(
      (mod) => mod.FeatureFlagContextProvider
    ),
  {
    ssr: false,
  }
);

const PostHogPageView = dynamic(
  () => import('@repo/ui/feature-flags').then((mod) => mod.PostHogPageView),
  { ssr: false }
);

const AnalyticsProvider = dynamic<TAnalyticsProviderProps>(
  () => import('@repo/ui/analytics').then((mod) => mod.AnalyticsProvider),
  {
    ssr: false,
  }
);

const SessionProvider = dynamic<SessionProviderProps>(
  () => import('next-auth/react').then((mod) => mod.SessionProvider),
  { ssr: false }
);

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config: TFeateFlagConfig = {
    provider: 'posthog',
    token: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
  };

  const analyticsOptions: Array<TAnalyticsOption> = [
    {
      name: 'google-analytics',
      id: '',
    },
  ];

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <FeatureFlagContextProvider config={config}>
            <AnalyticsProvider
              analyticsAppName="avila-tek-project"
              analyticsOptions={analyticsOptions}
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
              >
                <PostHogPageView />
                <ReactQueryProvider>{children}</ReactQueryProvider>
              </ThemeProvider>
            </AnalyticsProvider>
          </FeatureFlagContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
