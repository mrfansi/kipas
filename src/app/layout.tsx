import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KIPAS — KPI Insight & Performance Analysis System",
  description:
    "Sistem analisis kinerja dan insight KPI untuk organisasi Indonesia. Monitor, lacak, dan optimalkan performa tim Anda.",
  keywords: ["KPI", "performance", "analytics", "dashboard", "Indonesia"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          <Toaster position="bottom-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
