// getMetaData
// これはクライアントサイドから呼ばれる
// 別に機密データじゃないし大丈夫だろ

import { NextRequest } from "next/server";

import { db } from "@/firebase/firebase";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const id: string = requestBody.id;
    const res = await getMetaData(id);
    if (res && Object.keys(res).length === 0) {
      return new Response('Unauthorized', { status: 401 });
    } else {
      return new Response(JSON.stringify(res), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  }
  catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

const getMetaData = async (id: string) => {
  try {
    const dataFromFB = await db.ref(`tobipoPlaylist/items/${id}`).get();
    const data = dataFromFB.val();
    if (data !== null) {
      return {
        songName: data.songName,
        artist: data.artist,
        image640_url: data.image640_url,
      };
    } else {
      const baseURL: string = process.env.NEXT_PUBLIC_BASE_URL || "";
      return {
        songName: "Not found",
        artist: "Not found",
        image640_url: `${baseURL}/ogp_default.png`,
      };
    }

  } catch (error: any) {
    console.error('metadata検索エラー:', error);
    const baseURL: string = process.env.NEXT_PUBLIC_BASE_URL || "";
    return {
      songName: "Error",
      artist: "Error",
      image640_url: `${baseURL}/ogp_default.png`,
    };
  }
}