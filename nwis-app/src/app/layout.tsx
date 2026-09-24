import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "../components/layout/AppShell";
import { Inter, Public_Sans, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap'
});

const publicSans = Public_Sans({ 
  subsets: ['latin'], 
  variable: '--font-public-sans',
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
      className={cn("h-full", inter.variable, publicSans.variable, mono.variable)}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap');`
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('nwis-theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `
          }}
        />
      </head>
      <body className="h-full bg-[#F5F7F8] dark:bg-[#191E26] text-[#252B33] dark:text-white font-sans antialiased selection:bg-[#3FC3B6]/30 selection:text-[#191E26] transition-colors">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
