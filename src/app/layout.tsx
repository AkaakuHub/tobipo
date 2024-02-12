import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const m_plus = M_PLUS_Rounded_1c({
  weight: "400",
  subsets: ["latin"],
});

const siteName: string = "跳びポHub";
const description: string = "すべての跳びポが、ここにある。";
const url: string = process.env.NEXT_PUBLIC_THIS_SITE_URL || "";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: siteName,
    template: `%s - ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
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
      <body className={m_plus.className}
      >
        <div className="bodyDiv">
          {children}
        </div>
      </body>
    </html>
  );
}
