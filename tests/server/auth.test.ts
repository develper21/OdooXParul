import { beforeAll, describe, expect, it } from "vitest";

process.env.JWT_SECRET = "traveloop-test-secret";

let auth: typeof import("../../lib/auth");

beforeAll(async () => {
  auth = await import("../../lib/auth");
});

describe("authentication helpers", () => {
  it("hashes passwords and compares both matching and non-matching values", async () => {
    const passwordHash = await auth.hashPassword("secure-password");

    expect(passwordHash).not.toBe("secure-password");
    await expect(auth.comparePasswords("secure-password", passwordHash)).resolves.toBe(
      true
    );
    await expect(auth.comparePasswords("wrong-password", passwordHash)).resolves.toBe(
      false
    );
  });

  it("creates verifiable JWTs and rejects tampered tokens", () => {
    const token = auth.createJwtToken({ userId: "user-123", email: "user@example.com" });

    expect(auth.verifyJwtToken(token)).toMatchObject({
      userId: "user-123",
      email: "user@example.com",
    });
    expect(() => auth.verifyJwtToken(`${token}tampered`)).toThrow();
  });
});
