import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { ArticleCard } from "@/features/articles/article-card";

describe("ArticleCard", () => {
  const props = {
    id: "article-1",
    title: "Mon titre",
    content: "Le contenu de l'article.",
    authorName: "marie_dev",
    topicTitle: "React",
    createdAt: new Date("2026-01-15T10:00:00Z"),
  };

  it("affiche le titre, l'auteur et le thème", () => {
    render(<ArticleCard {...props} />);

    expect(screen.getByText("Mon titre")).toBeInTheDocument();
    expect(screen.getByText(/marie_dev/)).toBeInTheDocument();
    expect(screen.getByText(/React/)).toBeInTheDocument();
  });

  it("pointe vers la page de détail de l'article", () => {
    render(<ArticleCard {...props} />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/articles/article-1",
    );
  });
});
