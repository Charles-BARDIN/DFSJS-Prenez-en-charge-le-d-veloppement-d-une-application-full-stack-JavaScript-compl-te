import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

import { prismaMock } from "@/test/prisma-mock";
import { authorize } from "@/features/auth/authorize";

vi.mock("bcryptjs", () => ({ default: { compare: vi.fn() } }));

const mockedCompare = vi.mocked(bcrypt.compare);

// Utilisateur en base (mot de passe haché).
const dbUser = {
  id: "user-1",
  email: "user@example.com",
  username: "john_doe",
  password: "hashed-password",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authorize", () => {
  it("authentifie avec un e-mail et un bon mot de passe", async () => {
    prismaMock.user.findFirst.mockResolvedValue(dbUser as never);
    mockedCompare.mockResolvedValue(true as never);

    const result = await authorize({
      identifier: "user@example.com",
      password: "Secret#123",
    });

    expect(result).toEqual({
      id: "user-1",
      email: "user@example.com",
      name: "john_doe",
    });
    // Recherche par e-mail OU nom d'utilisateur.
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          { email: "user@example.com" },
          { username: "user@example.com" },
        ],
      },
    });
  });

  it("authentifie aussi avec un nom d'utilisateur", async () => {
    prismaMock.user.findFirst.mockResolvedValue(dbUser as never);
    mockedCompare.mockResolvedValue(true as never);

    const result = await authorize({
      identifier: "john_doe",
      password: "Secret#123",
    });

    expect(result).not.toBeNull();
  });

  it("retourne null si les identifiants sont mal formés", async () => {
    const result = await authorize({ identifier: "", password: "" });

    expect(result).toBeNull();
    expect(prismaMock.user.findFirst).not.toHaveBeenCalled();
  });

  it("retourne null si l'utilisateur n'existe pas", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const result = await authorize({
      identifier: "inconnu",
      password: "Secret#123",
    });

    expect(result).toBeNull();
    expect(mockedCompare).not.toHaveBeenCalled();
  });

  it("retourne null si le mot de passe est incorrect", async () => {
    prismaMock.user.findFirst.mockResolvedValue(dbUser as never);
    mockedCompare.mockResolvedValue(false as never);

    const result = await authorize({
      identifier: "john_doe",
      password: "MauvaisMdp#1",
    });

    expect(result).toBeNull();
  });
});
