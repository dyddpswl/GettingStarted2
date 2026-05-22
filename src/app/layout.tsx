import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "사례 기반 AI 수업설계 생성기",
  description: "공교육 교사를 위한 사례 기반 AI 수업설계 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
