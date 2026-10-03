"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  // Sync internal state if URL changes externally
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== searchTerm && pathname === "/search") {
      setSearchTerm(urlQuery);
    }
  }, [searchParams, pathname]);

  // Synchronize debounced query with URL navigation
  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    const currentQ = searchParams.get("q") || "";

    if (trimmed.length >= 2) {
      if (trimmed !== currentQ || pathname !== "/search") {
        const params = new URLSearchParams(searchParams.toString());
        params.set("q", trimmed);
        router.push(`/search?${params.toString()}`);
      }
    } else if (trimmed.length === 0 && currentQ && pathname === "/search") {
      router.push("/search");
    }
  }, [debouncedSearch, router, pathname, searchParams]);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setSearchTerm("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = () => {
    setSearchTerm("");
    if (pathname === "/search") {
      router.push("/search");
    }
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative flex items-center">
        <label htmlFor="global-search-input" className="sr-only">
          Search articles, movies, and social posts
        </label>
        <div className="absolute left-3.5 flex items-center pointer-events-none text-text-muted">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          id="global-search-input"
          type="search"
          autoComplete="off"
          placeholder="Search news, movies, posts... (Press / to focus)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.slice(0, 100))}
          maxLength={100}
          className="w-full h-10 pl-10 pr-9 rounded-xl border border-border bg-surface text-text text-xs sm:text-sm placeholder:text-text-muted/70 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        {searchTerm ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-surface-elevated border border-border rounded">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
