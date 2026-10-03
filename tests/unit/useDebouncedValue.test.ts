import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

describe("useDebouncedValue hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with the current value", () => {
    const { result } = renderHook(() => useDebouncedValue("initial", 400));
    expect(result.current).toBe("initial");
  });

  it("should update value only after the specified delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebouncedValue(val, delay),
      { initialProps: { val: "first", delay: 400 } }
    );

    expect(result.current).toBe("first");

    // Change value
    rerender({ val: "second", delay: 400 });

    // Advance halfway
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("first");

    // Advance past delay
    act(() => {
      vi.advanceTimersByTime(201);
    });
    expect(result.current).toBe("second");
  });

  it("should reset timer upon rapid successive changes", () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebouncedValue(val, delay),
      { initialProps: { val: "alpha", delay: 400 } }
    );

    rerender({ val: "beta", delay: 400 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ val: "gamma", delay: 400 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("alpha");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("gamma");
  });
});
