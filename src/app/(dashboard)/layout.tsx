import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { SettingsDrawer } from "@/components/settings/SettingsDrawer";
import { Toast } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden md:block w-64 lg:w-72 shrink-0 h-screen sticky top-0">
        <Sidebar className="h-full" />
      </div>

      {/* Main Content Area + Header */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto outline-none"
        >
          {children}
        </main>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav />

      {/* Global Settings Drawer */}
      <SettingsDrawer />

      {/* Global Toast Notifications */}
      <Toast />
    </div>
  );
}
