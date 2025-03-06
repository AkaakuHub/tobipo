import type { Metadata } from "next";

import { fetch_metadata } from "@/libs/APIhandler";

export const generateMetadata = async ({ params }: { params: any }): Promise<Metadata> => {
  const songID = (await params).id;

  let siteName: string = "跳びポHub";
  let description: string = "すべての跳びポが、ここにある。";
  let url: string = process.env.NEXT_PUBLIC_BASE_URL || "";
  let image640_url: string = `${url}/ogp_default.png`;
  // idは22文字固定
  if (songID.length === 22) {
    const res = await fetch_metadata(songID);
    const data = await res.json()

    siteName = `${data.songName} - 跳びポHub`;
    description = "すべての跳びポが、ここにある。";
    url = process.env.NEXT_PUBLIC_BASE_URL + "/" + songID || "";
    image640_url = data.image640_url;
  }

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
          url: image640_url,
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
          url: image640_url,
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
      <body>
        {children}
      </body>
    </html>
  );
}
