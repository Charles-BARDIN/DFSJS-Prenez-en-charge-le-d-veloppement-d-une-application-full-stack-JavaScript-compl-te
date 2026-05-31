import { describe, it, expect, vi, beforeEach } from "vitest";

import { prismaMock } from "@/test/prisma-mock";
import { createArticle } from "@/features/articles/actions";

const { mockedGetCurrentUser, mockedRedirect } = vi.hoisted(() => ({
  mockedGetCurrentUser: vi.fn(),
  mockedRedirect: vi.fn(),
}));

vi.mock("@/features/auth/current-user", () => ({
  getCurrentUser: mockedGetCurrentUser,
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: mockedRedirect }));

const currentUser = { id: "user-1" };

const buildFormData = (topicId: string, title: string, content: string) => {
  const formData = new FormData();
  formData.set("topicId", topicId);
  formData.set("title", title);
  formData.set("content", content);
  return formData;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createArticle", () => {
  it("crée l'article et redirige vers sa page", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);
    prismaMock.article.create.mockResolvedValue({ id: "article-1" } as never);

    await createArticle(
      null,
      buildFormData("topic-1", "Mon titre", "Mon contenu"),
    );

    expect(prismaMock.article.create).toHaveBeenCalledWith({
      data: {
        topicId: "topic-1",
        title: "Mon titre",
        content: "Mon contenu",
        authorId: "user-1",
      },
    });
    expect(mockedRedirect).toHaveBeenCalledWith("/articles/article-1");
  });

  it("échoue si l'utilisateur n'est pas connecté", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const result = await createArticle(
      null,
      buildFormData("topic-1", "Mon titre", "Mon contenu"),
    );

    expect(result?.success).toBe(false);
    expect(prismaMock.article.create).not.toHaveBeenCalled();
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("échoue si le titre est vide (validation)", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);

    const result = await createArticle(
      null,
      buildFormData("topic-1", "   ", "Mon contenu"),
    );

    expect(result?.success).toBe(false);
    expect(prismaMock.article.create).not.toHaveBeenCalled();
  });
});
