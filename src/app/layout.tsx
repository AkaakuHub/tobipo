import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const m_plus = M_PLUS_Rounded_1c({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "跳びポHub",
  description: "跳びポに関するサイト",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={m_plus.className}>{children}</body>
    </html>
  );
}
