import { describe, expect, it } from "vitest";
import { backendOrigin, restApiRoot } from "./backend-origin";

describe("backendOrigin", () => {
  it("returns default localhost when missing or blank", () => {
    expect(backendOrigin()).toBe("http://localhost:3333");
    expect(backendOrigin("")).toBe("http://localhost:3333");
    expect(backendOrigin("   ")).toBe("http://localhost:3333");
  });

  it("trims trailing slashes", () => {
    expect(backendOrigin("http://example.com/")).toBe("http://example.com");
    expect(backendOrigin("http://example.com///")).toBe("http://example.com");
  });

  it("strips a trailing /api segment once (hosting convention)", () => {
    expect(backendOrigin("https://api.example.com/api")).toBe(
      "https://api.example.com",
    );
    expect(backendOrigin("https://api.example.com/api/")).toBe(
      "https://api.example.com",
    );
  });

  it("strips repeated /api suffixes", () => {
    expect(backendOrigin("https://x.test/api/api")).toBe("https://x.test");
  });

  it("does not strip /api from the middle of the path", () => {
    expect(backendOrigin("https://x.test/foo/api/bar")).toBe(
      "https://x.test/foo/api/bar",
    );
  });
});

describe("restApiRoot", () => {
  it("appends /api to normalized origin", () => {
    expect(restApiRoot("http://localhost:3333")).toBe(
      "http://localhost:3333/api",
    );
  });

  it("uses default origin when raw empty", () => {
    expect(restApiRoot()).toBe("http://localhost:3333/api");
  });

  it("works when env already ended with /api", () => {
    expect(restApiRoot("https://host.example/api/")).toBe(
      "https://host.example/api",
    );
  });
});
