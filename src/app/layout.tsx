import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";
import { QueryProvider } from "@/lib/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EstimatePro - Manage Your Project Budgets",
  description: "A modern tool for professionals to create and manage project estimates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function () {
            try {
              var storedTheme = localStorage.getItem('theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              var isDark = storedTheme ? storedTheme === 'dark' : prefersDark;
              document.documentElement.classList.toggle('dark', isDark);
            } catch (error) {}
          })();`}
        </Script>
        <QueryProvider>
          <Shell>{children}</Shell>
        </QueryProvider>
      </body>
    </html>
  );
}
