/*
 * @Author: Mr.Car
 * @Date: 2024-09-04 23:22:48
 */
import clsx from 'clsx';
import {Inter} from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import {ReactNode} from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {routing} from '@/i18n/routing';
import { AntdRegistry } from '@ant-design/nextjs-registry';


const inter = Inter({subsets: ['latin']});

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params: {locale}
}: Omit<Props, 'children'>) {
  const t = await getTranslations({locale, namespace: 'LocaleLayout'});

  return {
    title: t('title')
  };
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html className="h-full" lang={locale} >
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={clsx(inter.className, 'flex h-full flex-col')}>
        <AntdRegistry>
          <NextIntlClientProvider messages={messages}>
            <Navigation/>
            {children}
            <Footer />
          </NextIntlClientProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
