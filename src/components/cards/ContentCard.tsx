"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ContentItem } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "./FavoriteButton";
import { formatRelativeTime, sanitizeExternalUrl } from "@/lib/formatters";
import { useAppDispatch } from "@/store/hooks";
import { recordHistory } from "@/store/slices/historySlice";
import { moveItemByStep } from "@/store/slices/feedOrderSlice";
import {
  ExternalLink,
  Newspaper,
  Film,
  MessageSquare,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentCardProps {
  item: ContentItem;
  index?: number;
  totalItems?: number;
  isDraggable?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
  };
  currentIds?: string[];
  onAnnounceMove?: (message: string) => void;
  className?: string;
}

export function ContentCard({
  item,
  index = 0,
  totalItems = 1,
  isDraggable = false,
  dragHandleProps,
  currentIds,
  onAnnounceMove,
  className,
}: ContentCardProps) {
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);

  const safeUrl = sanitizeExternalUrl(item.url, "#") || "#";

  const handleCtaClick = () => {
    const tmdbIdMatch =
      item.type === "movie" ? parseInt(item.id.replace("movie:", ""), 10) : undefined;

    dispatch(
      recordHistory({
        id: item.id,
        type: item.type,
        category: item.category,
        tmdbId: !isNaN(tmdbIdMatch!) ? tmdbIdMatch : undefined,
      })
    );
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (index > 0) {
      dispatch(moveItemByStep({ id: item.id, direction: "up", currentIds }));
      onAnnounceMove?.(`Moved ${item.title} up to position ${index} of ${totalItems}`);
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (index < totalItems - 1) {
      dispatch(moveItemByStep({ id: item.id, direction: "down", currentIds }));
      onAnnounceMove?.(`Moved ${item.title} down to position ${index + 2} of ${totalItems}`);
    }
  };

  const ctaLabel = {
    news: "Read Article",
    movie: "Watch Trailer",
    social: "View Post",
  }[item.type];

  const typeIcon = {
    news: <Newspaper className="w-3.5 h-3.5" />,
    movie: <Film className="w-3.5 h-3.5" />,
    social: <MessageSquare className="w-3.5 h-3.5" />,
  }[item.type];

  return (
    <article
      data-testid="feed-card"
      data-id={item.id}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border bg-surface hover:border-text-muted/30 transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden h-full",
        className
      )}
    >
      {/* Card Header Media Container (16:9) */}
      <div className="relative aspect-video w-full bg-surface-elevated overflow-hidden">
        {item.imageUrl && !imageError ? (
          <Image
            src={item.imageUrl}
            alt={item.title || "Content preview"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            unoptimized
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface-elevated to-surface text-text-muted p-4 text-center">
            <div className="p-3 rounded-xl bg-surface border border-border/80 shadow-xs mb-2">
              {typeIcon}
            </div>
            <span className="text-xs font-medium uppercase tracking-wider opacity-75">
              {item.source}
            </span>
          </div>
        )}

        {/* Favorite Button (Floating Top-Right) */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton item={item} />
        </div>

        {/* Drag Handle & Accessible Reorder Controls (Top-Left) */}
        {isDraggable && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-surface/90 backdrop-blur-xs border border-border/80 rounded-lg p-1 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
            <div
              {...dragHandleProps}
              data-testid="drag-handle"
              className="p-1 cursor-grab active:cursor-grabbing text-text-muted hover:text-text rounded"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="flex flex-col border-l border-border/60 pl-0.5">
              <button
                type="button"
                onClick={handleMoveUp}
                disabled={index === 0}
                aria-label={`Move ${item.title} up`}
                className="p-0.5 text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleMoveDown}
                disabled={index >= totalItems - 1}
                aria-label={`Move ${item.title} down`}
                className="p-0.5 text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="flex flex-col flex-1 p-5 gap-2.5">
        {/* Type & Meta Header */}
        <div className="flex items-center justify-between text-xs text-text-muted gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <Badge variant={item.type}>{item.type}</Badge>
            <span className="font-medium truncate text-text">{item.source}</span>
          </div>
          <time dateTime={item.publishedAt} className="shrink-0 text-text-muted/80">
            {formatRelativeTime(item.publishedAt)}
          </time>
        </div>

        {/* Social Author Preview */}
        {item.type === "social" && item.author && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            {item.author.avatarUrl && (
              <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-border">
                <Image
                  src={item.author.avatarUrl}
                  alt={item.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span className="font-semibold text-text">{item.author.name}</span>
            {item.author.handle && (
              <span className="text-text-muted">{item.author.handle}</span>
            )}
          </div>
        )}

        {/* Headline / Title */}
        <h3 className="font-semibold text-text text-base leading-snug line-clamp-2 mt-1">
          {item.title}
        </h3>

        {/* Description / Summary */}
        <p className="text-sm text-text-muted line-clamp-3 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Tags / Hashtags */}
        {item.category && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-elevated text-text-muted">
              #{item.category}
            </span>
            {item.hashtags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-elevated text-text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer CTA */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-auto">
          <span className="text-xs text-text-muted">
            {item.popularity ? `${item.popularity} score` : ""}
          </span>
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-elevated hover:bg-surface-hover text-text border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {item.type === "movie" ? (
              <Play className="w-3 h-3 fill-current" />
            ) : (
              <ExternalLink className="w-3 h-3" />
            )}
            {ctaLabel}
          </a>
        </div>
      </div>
    </article>
  );
}
