import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "고곳 GOGOT | 가고 싶은 곳을 한곳에",
  description:
    "가고 싶은 장소의 공유 링크를 한곳에. 고곳의 장소 링크 형식 확인을 시작해 보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main">
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}
