import React from "react";
import { PreferencesPanel } from "@/components/settings/PreferencesPanel";

export const metadata = {
  title: "Settings — Curate",
  description: "Customize your content preferences, followed hashtags, and appearance theme.",
};

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <nav aria-label="Breadcrumb" className="text-xs text-text-muted mb-1 font-medium">
          <span>Dashboard</span> <span className="mx-1">/</span> <span className="text-primary font-semibold">Settings</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
          Feed Preferences
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Customize which topics and hashtags populate your personalized feed, and tailor your display theme.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
        <PreferencesPanel />
      </div>
    </div>
  );
}
