import { LinkForm } from "@/features/imports/link-form";
import Link from "next/link";

export default function Home() {
  return (
    <div className="shell">
      <header className="header">
        <Link href="/" className="brand" aria-label="고곳 홈">
          <span className="brand-pin" aria-hidden="true">
            ●
          </span>{" "}
          gogot<span className="brand-ko">고곳</span>
        </Link>
        <span className="preview-badge">개발 미리보기</span>
      </header>
      <main id="main">
        <section className="intro" aria-labelledby="intro-title">
          <p className="eyebrow">A LITTLE LINK, YOUR NEXT PLACE</p>
          <h1 id="intro-title">
            가고 싶은 곳,
            <br />
            <span>잊지 말고 고곳.</span>
          </h1>
          <p className="intro-copy">
            피드에서 발견한 카페도, 다음 여행의 목적지도.
            <br className="desktop-break" /> 링크 하나로 모으는 나만의 장소
            지도를 준비하고 있어요.
          </p>
          <LinkForm />
          <p className="privacy-note">
            현재는 링크 형식만 확인하며, 외부 접속이나 저장은 하지 않아요.
          </p>
        </section>
        <section className="places-section" aria-labelledby="places-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MY LITTLE MAP</p>
              <h2 id="places-title">나의 다음 목적지</h2>
            </div>
            <span className="count">0개의 장소</span>
          </div>
          <div className="empty-state">
            <div className="map-illustration" aria-hidden="true">
              <span className="map-dot">●</span>
              <span className="map-route" />
            </div>
            <h3>아직은 비어 있는 나만의 지도</h3>
            <p>
              장소 저장 기능은 준비 중이에요.
              <br />
              위에서 공유 링크의 형식을 먼저 확인해 보세요.
            </p>
          </div>
        </section>
        <aside className="roadmap-note">
          <span aria-hidden="true">↗</span>
          <p>
            <strong>조금씩, 더 편리하게.</strong> 장소 분석과 저장, 지도 기능을
            순서대로 연결할 예정이에요.
          </p>
        </aside>
      </main>
      <footer>
        <span>gogot © {new Date().getFullYear()}</span>
        <span>가고 싶은 곳을 한곳에.</span>
      </footer>
    </div>
  );
}
