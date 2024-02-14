import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
// import "../globals.css";

import { fetch_metadata } from "../libs/APIhandler";

const m_plus = M_PLUS_Rounded_1c({
  weight: "400",
  subsets: ["latin"],
  variable: "--m-plus-rounded-1c",
});

export const generateMetadata = async ({ params }: { params: { id: string } }): Promise<Metadata> => {
  const res = await fetch_metadata(params.id);
  const data = await res.json()

  const siteName: string = `${data.songName} - 跳びポHub`;
  const description: string = "すべての跳びポが、ここにある。";
  const url: string = process.env.NEXT_PUBLIC_BASE_URL + "/" + params.id || "";

  return {
    title: siteName,
    openGraph: {
      title: siteName,
      description,
      url,
      siteName,
      locale: "ja_JP",
      type: "website",
      images: [
        {
          url: data.image640_url,
          width: 1200,
          height: 630,
          alt: "OGP画像の代替テキスト - 該当する曲のアルバムアートワーク",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [
        {
          url: data.image640_url,
          width: 1200,
          height: 630,
          alt: "OGP画像の代替テキスト - 該当する曲のアルバムアートワーク",
        },
      ],
      site: "@",
      creator: "@",
    },
  };
}

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
