import { describe, expect, it } from "vitest";
import { classifyLink } from "./classify-link";

describe("classifyLink", () => {
  it.each([
    ["https://www.instagram.com/p/AbC_123/?igsh=abc", "instagram", false],
    ["https://instagram.com/reel/Ab-123/", "instagram", false],
    ["https://naver.me/Ab123", "naver", true],
    ["https://map.naver.com/p/entry/place/123456", "naver", false],
    ["https://m.place.naver.com/restaurant/123/home", "naver", false],
    ["https://kko.to/Ab-123", "kakao", true],
    ["https://place.map.kakao.com/123", "kakao", false],
    ["https://map.kakao.com/?itemId=123", "kakao", false],
    ["https://map.kakao.com/link/map/123", "kakao", false],
    ["https://map.kakao.com/link/map/카페,37.5,127.0", "kakao", false],
  ])("recognizes %s", (input, platform, shortLink) => {
    expect(classifyLink(input)).toMatchObject({
      status: "recognized",
      platform,
      shortLink,
    });
  });

  it.each([
    "",
    " ",
    "not a url",
    "http://naver.me/abc",
    "https://user:pass@naver.me/abc",
    "https://naver.me:444/abc",
    "a".repeat(2049),
  ])("rejects invalid input %s", (input) => {
    expect(classifyLink(input).status).toBe("invalid");
  });

  it.each([
    "https://instagram.com.evil.test/p/abc",
    "https://evil.test/?url=https://naver.me/abc",
    "https://instagram.com/username/",
    "https://naver.me/",
    "https://map.kakao.com/",
    "https://127.0.0.1/place/123",
  ])("does not accept unrelated URLs %s", (input) => {
    expect(classifyLink(input).status).toBe("unsupported");
  });

  it("trims whitespace and removes fragments while retaining meaningful query", () => {
    expect(
      classifyLink(" https://map.kakao.com/?itemId=123#section "),
    ).toMatchObject({ url: "https://map.kakao.com/?itemId=123" });
  });
});
