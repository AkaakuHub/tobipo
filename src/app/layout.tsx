import type { Metadata } from "next";
import "./globals.css";

import { GoogleAnalytics } from '@next/third-parties/google';

const siteName: string = "跳びポHub";
const description: string = "すべての跳びポが、ここにある。";
const url: string = process.env.NEXT_PUBLIC_BASE_URL || "";
const googleSearchConsole: string = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE || "";

const googleAnalyticsId: string = process.env.NEXT_PUBLIC_GA_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: siteName,
  description,
  keywords: ["跳びポ", "跳びポHub", "アニソン", "アイドル", "飛びポ"],
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: `${url}/ogp_default.png`,
        width: 1200,
        height: 630,
        alt: "OGP画像の代替テキスト - 跳びポのイメージ画像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: [
      {
        url: `${url}/ogp_default.png`,
        width: 1200,
        height: 630,
        alt: "OGP画像の代替テキスト - 跳びポのイメージ画像",
      },
    ],
    site: "@",
    creator: "@",
  },
  verification: {
    google: googleSearchConsole,
  },
  alternates: {
    canonical: url,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <GoogleAnalytics gaId={googleAnalyticsId} />
      <body>
        {children}
      </body>
    </html>
  );
}
