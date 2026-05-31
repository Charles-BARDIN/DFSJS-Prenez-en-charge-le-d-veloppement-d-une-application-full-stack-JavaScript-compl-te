import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prismaMock } from "@/test/prisma-mock";
import { updateProfile } from "@/features/profile/actions";

const { mockedGetCurrentUser } = vi.hoisted(() => ({
  mockedGetCurrentUser: vi.fn(),
}));

vi.mock("@/features/auth/current-user", () => ({
  getCurrentUser: mockedGetCurrentUser,
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed-password") },
}));

const currentUser = { id: "user-1" };

// Construit un FormData de profil ; le mot de passe est optionnel.
const buildFormData = (email: string, username: string, password = "") => {
  const formData = new FormData();
  formData.set("email", email);
  formData.set("username", username);
  formData.set("password", password);
  return formData;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateProfile", () => {
  it("met à jour le profil sans toucher au mot de passe quand il est vide", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);

    const result = await updateProfile(
      null,
      buildFormData("new@example.com", "new_name"),
    );

    expect(result.success).toBe(true);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { email: "new@example.com", username: "new_name" },
    });
  });

  it("hache et met à jour le mot de passe quand il est fourni", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);

    const result = await updateProfile(
      null,
      buildFormData("new@example.com", "new_name", "Secret#123"),
    );

    expect(result.success).toBe(true);
    expect(bcrypt.hash).toHaveBeenCalledWith("Secret#123", 10);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        email: "new@example.com",
        username: "new_name",
        password: "hashed-password",
      },
    });
  });

  it("échoue si l'utilisateur n'est pas connecté", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const result = await updateProfile(
      null,
      buildFormData("new@example.com", "new_name"),
    );

    expect(result.success).toBe(false);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("échoue si l'e-mail est invalide (validation)", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);

    const result = await updateProfile(
      null,
      buildFormData("pas-un-email", "new_name"),
    );

    expect(result.success).toBe(false);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("renvoie une erreur d'unicité (P2002)", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);
    prismaMock.user.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint", {
        code: "P2002",
        clientVersion: "test",
      }),
    );

    const result = await updateProfile(
      null,
      buildFormData("taken@example.com", "taken"),
    );

    expect(result.success).toBe(false);
  });
});
