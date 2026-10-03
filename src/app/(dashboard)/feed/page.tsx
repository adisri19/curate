import React, { Suspense } from "react";
import { FeedList } from "@/components/feed/FeedList";
import { CardSkeleton } from "@/components/cards/CardSkeleton";

export const metadata = {
  title: "My Feed — Curate",
  description: "Personalized content feed tailored to your favorite categories and hashtags.",
};

export default function FeedPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <nav aria-label="Breadcrumb" className="text-xs text-text-muted mb-1 font-medium">
          <span>Dashboard</span> <span className="mx-1">/</span> <span className="text-primary font-semibold">Feed</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
          Personalized Feed
        </h1>
        <p className="text-sm text-text-muted mt-1 max-w-2xl">
          A unified stream of breaking headlines, cinema discoveries, and trending community posts tuned to your topics.
        </p>
      </div>

      {/* Feed Content */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <FeedList />
      </Suspense>
    </div>
  );
}
