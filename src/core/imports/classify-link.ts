import { z } from "zod";

export type Platform = "instagram" | "naver" | "kakao";
export type LinkResult =
  | {
      status: "recognized";
      platform: Platform;
      url: string;
      shortLink: boolean;
    }
  | { status: "invalid" | "unsupported"; message: string };

const inputSchema = z.string().trim().min(1).max(2048);

/** 네트워크 접근 없이 URL 형식만 판별합니다. 장소 추출 성공을 의미하지 않습니다. */
export function classifyLink(input: string): LinkResult {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "invalid",
      message: "공유 링크를 2,048자 이내로 입력해 주세요.",
    };
  }

  let url: URL;
  try {
    url = new URL(parsed.data);
  } catch {
    return {
      status: "invalid",
      message: "https://로 시작하는 전체 링크를 입력해 주세요.",
    };
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port) {
    return {
      status: "invalid",
      message: "로그인 정보나 별도 포트가 없는 HTTPS 링크를 입력해 주세요.",
    };
  }

  const host = url.hostname.toLowerCase();
  const path = url.pathname;
  let platform: Platform | undefined;
  let shortLink = false;

  if (
    ["instagram.com", "www.instagram.com", "m.instagram.com"].includes(host) &&
    /^\/(p|reel|reels|tv)\/[A-Za-z0-9_-]+\/?$/.test(path)
  ) {
    platform = "instagram";
  } else if (host === "naver.me" && /^\/[A-Za-z0-9]+\/?$/.test(path)) {
    platform = "naver";
    shortLink = true;
  } else if (
    [
      "map.naver.com",
      "m.map.naver.com",
      "place.naver.com",
      "m.place.naver.com",
    ].includes(host) &&
    /\/(?:place|restaurant|cafe|accommodation)\/\d+(?:\/|$)/.test(path)
  ) {
    platform = "naver";
  } else if (host === "kko.to" && /^\/[A-Za-z0-9_-]+\/?$/.test(path)) {
    platform = "kakao";
    shortLink = true;
  } else if (
    (host === "place.map.kakao.com" && /^\/\d+\/?$/.test(path)) ||
    (host === "map.kakao.com" &&
      path === "/" &&
      /^\d+$/.test(url.searchParams.get("itemId") ?? "")) ||
    (host === "map.kakao.com" &&
      /^\/link\/map\/(?:\d+|[^/]+,-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?)\/?$/.test(
        path,
      ))
  ) {
    platform = "kakao";
  }

  if (!platform) {
    return {
      status: "unsupported",
      message:
        "아직 확인할 수 없는 링크 형식이에요. 인스타그램 게시물 또는 네이버·카카오 장소 공유 링크를 입력해 주세요.",
    };
  }
  // 원본 쿼리는 장소 식별에 필요할 수 있어 유지합니다. 외부 요청 전 별도 보안 검증이 필요합니다.
  url.hash = "";
  return { status: "recognized", platform, url: url.toString(), shortLink };
}
