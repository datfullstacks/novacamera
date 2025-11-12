import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { QueryProvider } from "@/providers/QueryProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ToastContainer } from "@/components/atoms/ui/Toast";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nova Camera - Professional Photography Equipment Rental",
  description: "Rent professional photography equipment including cameras, lenses, lighting, and accessories",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current locale and messages dynamically
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <QueryProvider>
              {children}
              <ToastContainer />
            </QueryProvider>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}