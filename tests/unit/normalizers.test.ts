import { describe, it, expect } from "vitest";
import { normalizeNewsArticle } from "@/services/normalizers/newsNormalizer";
import { normalizeMovie } from "@/services/normalizers/movieNormalizer";
import { normalizeSocialPost } from "@/services/normalizers/socialNormalizer";

describe("API Normalizers", () => {
  describe("newsNormalizer", () => {
    it("should filter out articles with [Removed] title or description", () => {
      const removedArticle = {
        title: "[Removed]",
        description: "[Removed]",
        url: "https://example.com/removed",
      };
      expect(normalizeNewsArticle(removedArticle)).toBeNull();

      const partialRemoved = {
        title: "[Removed] Article content was deleted",
        description: "Valid description",
        url: "https://example.com/removed2",
      };
      expect(normalizeNewsArticle(partialRemoved)).toBeNull();
    });

    it("should strip HTML tags and decode HTML entities", () => {
      const htmlArticle = {
        title: "<b>Breaking:</b> Tech firm announces &amp; ships &quot;SuperAI&quot;",
        description: "<p>The company said &lt;we are excited&gt; about the new model.</p>",
        url: "https://example.com/article",
      };

      const normalized = normalizeNewsArticle(htmlArticle);
      expect(normalized).not.toBeNull();
      expect(normalized?.title).toBe('Breaking: Tech firm announces & ships "SuperAI"');
      expect(normalized?.description).toBe("The company said <we are excited> about the new model.");
    });

    it("should require a valid external http/https URL", () => {
      const invalidUrlArticle = {
        title: "Test Article",
        url: "javascript:alert(1)",
      };
      expect(normalizeNewsArticle(invalidUrlArticle)).toBeNull();
    });
  });

  describe("movieNormalizer", () => {
    it("should normalize TMDB movie structure with poster image and TMDB link", () => {
      const rawMovie = {
        id: 693134,
        title: "Dune: <b>Part Two</b>",
        overview: "Paul Atreides unites with <i>Chani</i>.",
        poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        release_date: "2024-03-01",
        popularity: 98.4,
        genre_ids: [878, 12],
      };

      const normalized = normalizeMovie(rawMovie);
      expect(normalized).not.toBeNull();
      expect(normalized?.id).toBe("movie:693134");
      expect(normalized?.type).toBe("movie");
      expect(normalized?.title).toBe("Dune: Part Two");
      expect(normalized?.imageUrl).toBe("https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg");
      expect(normalized?.url).toBe("https://www.themoviedb.org/movie/693134");
      expect(normalized?.category).toBe("Science Fiction");
    });
  });

  describe("socialNormalizer", () => {
    it("should normalize social post with author handle and engagement score", () => {
      const rawPost = {
        id: "post_1",
        text: "Autonomous agents are shifting to harness engineering.\nSecond line details here.",
        author: {
          name: "Elena Rostova",
          handle: "elena_ai",
        },
        hashtags: ["#technology", "#ai"],
        createdAt: "2026-03-01T12:00:00Z",
        likes: 100,
        retweets: 25,
      };

      const normalized = normalizeSocialPost(rawPost);
      expect(normalized).not.toBeNull();
      expect(normalized?.id).toBe("social:post_1");
      expect(normalized?.type).toBe("social");
      expect(normalized?.title).toBe("Autonomous agents are shifting to harness engineering.");
      expect(normalized?.source).toBe("@elena_ai");
      expect(normalized?.hashtags).toEqual(["technology", "ai"]);
      expect(normalized?.popularity).toBe(150); // 100 + 25 * 2
    });
  });
});
