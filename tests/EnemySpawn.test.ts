import { describe, it, expect, vi } from "vitest";
import { calculateSpawnPosition } from "../src/classes/entities/Enemy.js";

describe("calculateSpawnPosition", () => {
  it("returns valid spawn position", () => {
    const result = calculateSpawnPosition(600, 400, 16, 1);
    expect(result).toHaveProperty("x");
    expect(result).toHaveProperty("y");
    expect(result).toHaveProperty("vx");
    expect(result).toHaveProperty("vy");
  });

  it("spawns from top when side is 0", () => {
    Math.random = vi.fn(() => 0.1);
    const result = calculateSpawnPosition(600, 400, 16, 1);
    expect(result.y).toBe(-16);
    expect(result.vy).toBe(1);
  });

  it("spawns from right when side is 1", () => {
    Math.random = vi.fn(() => 0.4);
    const result = calculateSpawnPosition(600, 400, 16, 1);
    expect(result.x).toBe(600);
    expect(result.vx).toBe(-1);
  });

  it("spawns from bottom when side is 2", () => {
    Math.random = vi.fn(() => 0.6);
    const result = calculateSpawnPosition(600, 400, 16, 1);
    expect(result.y).toBe(400);
    expect(result.vy).toBe(-1);
  });

  it("spawns from left when side is 3", () => {
    Math.random = vi.fn(() => 0.9);
    const result = calculateSpawnPosition(600, 400, 16, 1);
    expect(result.x).toBe(-16);
    expect(result.vx).toBe(1);
  });
});
