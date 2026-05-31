import { describe, it, expect, vi, beforeEach } from "vitest";

import { prismaMock } from "@/test/prisma-mock";
import { getCurrentUser } from "@/features/auth/current-user";
import { addComment } from "@/features/comments/actions";

vi.mock("@/features/auth/current-user", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const currentUser = { id: "user-1" };

// Construit un FormData de commentaire pour les Server Actions.
const buildFormData = (articleId: string, content: string) => {
  const formData = new FormData();
  formData.set("articleId", articleId);
  formData.set("content", content);
  return formData;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("addComment", () => {
  it("crée le commentaire pour un article existant", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);
    prismaMock.article.findUnique.mockResolvedValue({ id: "article-1" } as never);

    const result = await addComment(null, buildFormData("article-1", "Super !"));

    expect(result.success).toBe(true);
    expect(prismaMock.comment.create).toHaveBeenCalledWith({
      data: {
        content: "Super !",
        articleId: "article-1",
        authorId: "user-1",
      },
    });
  });

  it("échoue si l'utilisateur n'est pas connecté", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const result = await addComment(null, buildFormData("article-1", "Hi"));

    expect(result.success).toBe(false);
    expect(prismaMock.comment.create).not.toHaveBeenCalled();
  });

  it("échoue si le commentaire est vide (validation)", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);

    const result = await addComment(null, buildFormData("article-1", "   "));

    expect(result.success).toBe(false);
    expect(prismaMock.comment.create).not.toHaveBeenCalled();
  });

  it("échoue si l'article n'existe pas", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);
    prismaMock.article.findUnique.mockResolvedValue(null);

    const result = await addComment(null, buildFormData("inconnu", "Coucou"));

    expect(result.success).toBe(false);
    expect(prismaMock.comment.create).not.toHaveBeenCalled();
  });
});
