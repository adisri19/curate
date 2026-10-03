"use client";

import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { motion, useReducedMotion } from "framer-motion";
import { ContentCard } from "@/components/cards/ContentCard";
import { ContentItem } from "@/types/content";
import { useAppDispatch } from "@/store/hooks";
import { reorder } from "@/store/slices/feedOrderSlice";
import { cn } from "@/lib/utils";

const ITEM_TYPE = "FEED_CARD";

interface DragItem {
  index: number;
  id: string;
}

interface DraggableCardProps {
  item: ContentItem;
  index: number;
  totalItems: number;
  currentIds?: string[];
  onAnnounceMove?: (message: string) => void;
}

export function DraggableCard({
  item,
  index,
  totalItems,
  currentIds,
  onAnnounceMove,
}: DraggableCardProps) {
  const dispatch = useAppDispatch();
  const cardRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: (): DragItem => ({ index, id: item.id }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem: DragItem) => {
      if (draggedItem.index === index) return;
      dispatch(reorder({ fromIndex: draggedItem.index, toIndex: index, currentIds }));
      draggedItem.index = index;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Connect drop to whole card, drag to handle, preview to whole card
  preview(drop(cardRef));
  drag(dragHandleRef);

  return (
    <motion.div
      ref={cardRef}
      layout={!prefersReducedMotion}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 30,
      }}
      className={cn(
        "h-full relative transition-opacity duration-150",
        isDragging && "opacity-30 scale-95",
        isOver && canDrop && "ring-2 ring-primary ring-offset-2 rounded-2xl"
      )}
    >
      <ContentCard
        item={item}
        index={index}
        totalItems={totalItems}
        isDraggable={true}
        dragHandleProps={{ ref: dragHandleRef }}
        currentIds={currentIds}
        onAnnounceMove={onAnnounceMove}
      />
    </motion.div>
  );
}
