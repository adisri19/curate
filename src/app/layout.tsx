import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { StoreProvider } from "@/components/providers/StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Curate — Personalized Content Dashboard",
  description:
    "A unified, modern content dashboard personalizing news headlines, cinematic recommendations, and social updates with custom drag-and-drop feeds and offline favorites.",
};

const themeInitScript = `
  (function() {
    try {
      var raw = localStorage.getItem('pcd:v1');
      var theme = 'system';
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.preferences && parsed.preferences.theme) {
          theme = parsed.preferences.theme;
        }
      }
      var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="antialiased font-sans min-h-screen">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
