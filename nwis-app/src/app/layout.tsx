import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "../components/layout/AppShell";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const sans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
});

const mono = JetBrains_Mono({
  subsets: ['latin'], 
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: "NWIS — Nearby Wells Intelligence System | Oil India Limited",
  description: "AI-Powered Offset Well Knowledge and Decision Support Platform for Drilling Operations across the Assam-Arakan Basin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={cn("h-full", sans.variable, mono.variable)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('nwis-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `
          }}
        />
      </head>
      <body className="h-full bg-neutral-50 dark:bg-[#08090d] text-neutral-900 dark:text-neutral-100 font-sans antialiased selection:bg-amber-100 selection:text-amber-900 transition-colors">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
