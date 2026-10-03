import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  stripHtml,
  truncateText,
  sanitizeExternalUrl,
  formatRelativeTime,
  normalizeHashtag,
} from "@/lib/formatters";

describe("Formatters and Sanitizers", () => {
  describe("stripHtml", () => {
    it("should strip tags and decode entities", () => {
      expect(stripHtml("<script>alert(1)</script>Hello <b>World</b> &amp; Friends")).toBe(
        "alert(1)Hello World & Friends"
      );
      expect(stripHtml(null)).toBe("");
    });
  });

  describe("truncateText", () => {
    it("should return string intact if shorter than maxLength", () => {
      expect(truncateText("Short text", 20)).toBe("Short text");
    });

    it("should truncate at word boundaries with ellipsis", () => {
      const text = "This is a long sentence intended to test truncation behavior cleanly.";
      const truncated = truncateText(text, 25);
      expect(truncated.endsWith("...")).toBe(true);
      expect(truncated.length).toBeLessThanOrEqual(28);
    });
  });

  describe("sanitizeExternalUrl", () => {
    it("should permit valid http and https URLs", () => {
      expect(sanitizeExternalUrl("https://example.com/test")).toBe("https://example.com/test");
      expect(sanitizeExternalUrl("http://example.com/test")).toBe("http://example.com/test");
    });

    it("should reject javascript: or data: protocols and return fallback", () => {
      expect(sanitizeExternalUrl("javascript:alert(1)", "#")).toBe("#");
      expect(sanitizeExternalUrl("data:text/html,test", "#")).toBe("#");
      expect(sanitizeExternalUrl(null, "#")).toBe("#");
    });
  });

  describe("normalizeHashtag", () => {
    it("should strip leading hash, remove special characters, and lowercase", () => {
      expect(normalizeHashtag("###NextJS_2026!")).toBe("nextjs_2026");
      expect(normalizeHashtag("  #AI  ")).toBe("ai");
    });

    it("should truncate to maximum 30 characters", () => {
      const longTag = "a".repeat(40);
      expect(normalizeHashtag(longTag).length).toBe(30);
    });
  });

  describe("formatRelativeTime", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-03-01T12:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return 'just now' for times under 45 seconds", () => {
      expect(formatRelativeTime("2026-03-01T11:59:30Z")).toBe("just now");
    });

    it("should format minutes ago", () => {
      expect(formatRelativeTime("2026-03-01T11:45:00Z")).toBe("15m ago");
    });

    it("should format hours ago", () => {
      expect(formatRelativeTime("2026-03-01T09:00:00Z")).toBe("3h ago");
    });

    it("should format 'yesterday'", () => {
      expect(formatRelativeTime("2026-02-28T10:00:00Z")).toBe("yesterday");
    });
  });
});
