import { describe, it, expect } from "vitest";

import { formatDate } from "@/features/articles/format";

describe("formatDate", () => {
  it("formate une date en français (format long)", () => {
    const formatted = formatDate(new Date("2026-01-15T10:00:00Z"));
    // Format « 15 janvier 2026 » (insensible à l'heure locale sur ce format).
    expect(formatted).toContain("janvier");
    expect(formatted).toContain("2026");
  });
});
