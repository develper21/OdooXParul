import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "../../app/api/cities/route";

describe("GET /api/cities", () => {
  it("returns cities sorted by popularity", async () => {
    const response = await GET(new NextRequest("http://localhost/api/cities"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].name).toBe("New York");
    expect(body.data[0].popularity).toBeGreaterThanOrEqual(body.data[1].popularity);
  });

  it("filters cities by query and region", async () => {
    const request = new NextRequest(
      "http://localhost/api/cities?q=france&region=europe"
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual([
      expect.objectContaining({ name: "Paris", country: "France" }),
    ]);
  });

  it("returns no cities when the query and region do not match", async () => {
    const request = new NextRequest(
      "http://localhost/api/cities?q=tokyo&region=europe"
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.total).toBe(0);
  });
});
