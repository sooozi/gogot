"use client";

import { useState } from "react";
import { classifyLink, type LinkResult } from "@/core/imports/classify-link";

const platformNames = {
  instagram: "인스타그램",
  naver: "네이버 지도",
  kakao: "카카오맵",
};

export function LinkForm() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<LinkResult | null>(null);
  const failed = result !== null && result.status !== "recognized";

  return (
    <form
      className="link-card"
      onSubmit={(event) => {
        event.preventDefault();
        setResult(classifyLink(value));
      }}
    >
      <label htmlFor="place-link">어디를 발견하셨나요?</label>
      <p id="link-help" className="field-help">
        인스타그램 · 네이버 지도 · 카카오맵의 공유 링크
      </p>
      <div className="input-row">
        <input
          id="place-link"
          name="url"
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="https:// 장소 링크를 붙여넣어 주세요"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setResult(null);
          }}
          aria-invalid={failed}
          aria-describedby={`link-help${result ? " link-result" : ""}`}
        />
        <button type="submit">
          링크 형식 확인 <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {result && (
          <p
            id="link-result"
            className={`result ${failed ? "result-error" : "result-success"}`}
          >
            {result.status === "recognized"
              ? `${result.platform === "naver" && result.shortLink ? "네이버 공유" : platformNames[result.platform]}${result.shortLink ? " 단축" : ""} 링크 형식이에요. 장소 분석·저장은 아직 지원하지 않아요.${result.shortLink ? " 단축 링크의 실제 목적지는 확인하지 않았어요." : ""}`
              : result.message}
          </p>
        )}
      </div>
    </form>
  );
}
