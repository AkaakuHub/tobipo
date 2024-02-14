// getMetaData

import { NextRequest } from "next/server";

import { kv } from "@vercel/kv";
function kvKey(name: string) {
  return `${name}-key`;
}

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const id: string = requestBody.id;
    const res = await makeMetadataById(id);
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

const makeMetadataById = async (id: string) => {
  try {
    const dataFromKV = await kv.json.get(kvKey("tobipoPlaylist"), "$");
    const fileData = dataFromKV[0];
    const data = fileData.items;
    const index = data.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      const target = data[index];
      return {
        songName: target.songName,
        artist: target.artist,
        image640_url: target.image640_url,
      };

    }
    const baseURL: string = process.env.NEXT_PUBLIC_BASE_URL || "";
    return {
      songName: "Not found",
      artist: "Not found",
      image640_url: `${baseURL}/ogp_default.png`,
    };
  } catch (error: any) {
    console.error('検索エラー:', error);
    const baseURL: string = process.env.NEXT_PUBLIC_BASE_URL || "";
    return {
      songName: "Error",
      artist: "Error",
      image640_url: `${baseURL}/ogp_default.png`,
    };
  }
}