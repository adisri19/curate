import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-text">
      <div className="p-4 rounded-2xl bg-surface-elevated border border-border text-primary mb-4 shadow-sm">
        <Compass className="w-10 h-10 stroke-[1.5]" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
        Page not found
      </h1>
      <p className="text-sm text-text-muted max-w-md mb-8 leading-relaxed">
        The dashboard view you are trying to access does not exist or may have been moved.
      </p>
      <Link href="/feed">
        <Button variant="primary" size="md" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to My Feed
        </Button>
      </Link>
    </div>
  );
}
