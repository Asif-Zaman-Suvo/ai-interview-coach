import { afterEach, describe, expect, it } from "vitest";
import { apiUrl } from "./api-url";

const ENV_KEY = "NEXT_PUBLIC_API_URL";

describe("apiUrl", () => {
  const previous = process.env[ENV_KEY];

  afterEach(() => {
    if (previous === undefined) {
      delete process.env[ENV_KEY];
    } else {
      process.env[ENV_KEY] = previous;
    }
  });

  it("prefixes REST paths with /api under normalized origin", () => {
    process.env[ENV_KEY] = "http://localhost:3333";
    expect(apiUrl("/sessions/foo")).toBe(
      "http://localhost:3333/api/sessions/foo",
    );
  });

  it("adds leading slash when endpoint omits it", () => {
    process.env[ENV_KEY] = "http://localhost:3333";
    expect(apiUrl("sessions/foo")).toBe(
      "http://localhost:3333/api/sessions/foo",
    );
  });

  it("maps legacy auth paths to origin without /api prefix", () => {
    process.env[ENV_KEY] = "http://localhost:3333";
    expect(apiUrl("/auth/me")).toBe("http://localhost:3333/auth/me");
    expect(apiUrl("/auth/register")).toBe(
      "http://localhost:3333/auth/register",
    );
  });

  it("strips trailing /api from env before building REST URL", () => {
    process.env[ENV_KEY] = "https://api.example.com/api";
    expect(apiUrl("/roles")).toBe("https://api.example.com/api/roles");
  });

  it("strips trailing /api from env for legacy auth paths", () => {
    process.env[ENV_KEY] = "https://api.example.com/api";
    expect(apiUrl("/auth/me")).toBe("https://api.example.com/auth/me");
  });

  it("uses default origin when env unset", () => {
    delete process.env[ENV_KEY];
    expect(apiUrl("/x")).toBe("http://localhost:3333/api/x");
  });
});
