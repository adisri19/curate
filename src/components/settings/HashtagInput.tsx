"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addHashtag, removeHashtag } from "@/store/slices/preferencesSlice";
import { normalizeHashtag } from "@/lib/formatters";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { X, Hash, Plus } from "lucide-react";

export function HashtagInput() {
  const dispatch = useAppDispatch();
  const hashtags = useAppSelector((state) => state.preferences.hashtags);

  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const normalized = normalizeHashtag(inputVal);
    if (!normalized) {
      setError("Please enter a valid tag name.");
      return;
    }

    if (normalized.length > 30) {
      setError("Hashtags must be 30 characters or fewer.");
      return;
    }

    if (hashtags.includes(normalized)) {
      setError("This hashtag is already added.");
      return;
    }

    if (hashtags.length >= 10) {
      setError("Maximum of 10 hashtags allowed.");
      return;
    }

    dispatch(addHashtag(normalized));
    setInputVal("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="hashtag-input" className="text-sm font-semibold text-text">
          Followed Hashtags
        </label>
        <span className="text-xs text-text-muted">{hashtags.length} / 10</span>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          id="hashtag-input"
          placeholder="e.g. ai, webdev, cinema"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            if (error) setError(null);
          }}
          leftIcon={<Hash className="w-4 h-4" />}
          error={error || undefined}
          maxLength={30}
        />
        <Button
          type="submit"
          variant="secondary"
          size="md"
          disabled={!inputVal.trim() || hashtags.length >= 10}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </form>

      {/* Render Active Hashtags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-medium bg-surface-elevated text-text border border-border group"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => dispatch(removeHashtag(tag))}
              aria-label={`Remove #${tag}`}
              className="p-0.5 rounded hover:bg-border text-text-muted hover:text-text transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
