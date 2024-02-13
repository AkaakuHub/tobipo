import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";

import "./globals.css";

const m_plus = M_PLUS_Rounded_1c({
  weight: "400",
  subsets: ["latin"],
  variable: "--m-plus-rounded-1c",
});

const siteName: string = "跳びポHub";
const description: string = "すべての跳びポが、ここにある。";
const url: string = process.env.NEXT_PUBLIC_BASE_URL || "";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: siteName,
  description,
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
    google: 'サーチコンソール',
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
      <body className={`${m_plus.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
