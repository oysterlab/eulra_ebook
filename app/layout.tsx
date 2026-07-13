import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "취향을 공간에 풀어내는 시대 | ELURA";
const description =
  "아트는 공간의 필수품이 아니다. 공간을 먼저 점검하고, 아트가 필요한 경우에만 사용자 선택 자료와 실제 방, AI와 제작 조건을 함께 살펴보는 ELURA의 웹 ebook.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    requestHeaders.get("host") ||
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const socialImage = `${origin}/og-v2.png`;

  return {
    title,
    description,
    applicationName: "취향을 공간에 풀어내는 시대",
    authors: [{ name: "ELURA" }],
    creator: "ELURA",
    publisher: "ELURA",
    category: "문화비평",
    keywords: [
      "공간 맞춤",
      "취향",
      "인테리어",
      "AI",
      "주문형 생산",
      "ELURA",
      "웹 ebook",
    ],
    robots: { index: true, follow: true },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: origin,
      siteName: "ELURA",
      title,
      description,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "취향을 공간에 풀어내는 시대 - ELURA Culture Forecast 01",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9edf0" },
    { media: "(prefers-color-scheme: dark)", color: "#111720" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
