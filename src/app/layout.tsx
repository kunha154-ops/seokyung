import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: {
    default: "대한예수교장로회 서경노회",
    template: "%s | 서경노회",
  },
  description:
    "대한예수교장로회 서경노회 공식 홈페이지. 노회 소식, 공지사항, 포토갤러리, 행정서식 자료실을 제공합니다.",
  keywords: ["서경노회", "대한예수교장로회", "장로회", "노회"],
  openGraph: {
    title: "대한예수교장로회 서경노회",
    description: "서경노회 공식 홈페이지",
    type: "website",
    locale: "ko_KR",
    url: "https://seokyung.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
