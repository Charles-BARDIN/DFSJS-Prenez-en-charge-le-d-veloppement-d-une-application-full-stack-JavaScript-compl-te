import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { addComment } from "@/features/comments/actions";
import { CommentForm } from "@/features/comments/comment-form";

vi.mock("@/features/comments/actions", () => ({ addComment: vi.fn() }));

const mockedAddComment = vi.mocked(addComment);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CommentForm", () => {
  it("affiche le champ de saisie et le bouton d'envoi", () => {
    render(<CommentForm articleId="article-1" />);

    expect(
      screen.getByPlaceholderText("Écrivez ici votre commentaire"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Envoyer le commentaire" }),
    ).toBeInTheDocument();
  });

  it("affiche l'erreur de validation renvoyée par l'action", async () => {
    mockedAddComment.mockResolvedValue({
      success: false,
      error: "Le formulaire contient des erreurs.",
      fieldErrors: { content: "Le commentaire ne peut pas être vide." },
    });

    render(<CommentForm articleId="article-1" />);

    await userEvent.type(
      screen.getByPlaceholderText("Écrivez ici votre commentaire"),
      "x",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Envoyer le commentaire" }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Le commentaire ne peut pas être vide.");
  });
});
