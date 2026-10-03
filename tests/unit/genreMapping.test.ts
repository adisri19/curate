import { describe, it, expect } from "vitest";
import {
  mapCategoriesToTmdbGenreIds,
  getTmdbGenreNames,
  CATEGORY_TO_TMDB_GENRE_MAP,
} from "@/lib/genreMapping";

describe("TMDB Genre Mapping", () => {
  it("should correctly map dashboard categories to TMDB genre IDs", () => {
    expect(CATEGORY_TO_TMDB_GENRE_MAP["technology"]).toBe(878); // Sci-Fi
    expect(CATEGORY_TO_TMDB_GENRE_MAP["sports"]).toBe(99); // Documentary
    expect(CATEGORY_TO_TMDB_GENRE_MAP["entertainment"]).toBe(35); // Comedy
  });

  it("should map array of category strings to deduplicated numeric IDs", () => {
    const ids = mapCategoriesToTmdbGenreIds(["technology", "science", "sports"]);
    expect(ids).toContain(878);
    expect(ids).toContain(99);
    // Deduplication check
    expect(ids.filter((id) => id === 878).length).toBe(1);
  });

  it("should translate genre IDs into human readable genre names", () => {
    const names = getTmdbGenreNames([878, 28, 99]);
    expect(names).toEqual(["Science Fiction", "Action", "Documentary"]);
  });
});
