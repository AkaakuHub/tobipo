// getSingleData

import { NextRequest } from "next/server";

import { db } from "@/firebase/firebase";
import { TobipoData } from "@/app/types";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const id: string = requestBody.id;
    const res = await getSingleData(id);
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

const dummyData: TobipoData = {
  songName: "Not found",
  artist: "Not found",
  image640_url: "/notFound.png",
  external_urls_spotify: "",
  preview_url: "",
};

const getSingleData = async (id: string) => {
  try {
    // console.log('idを取得していく:', id);
    const dataFromFB = await db.ref(`tobipoPlaylist/items/${id}`).get();
    const data = dataFromFB.val();
    // console.log('dataはこれ:', data);
    if (data !== null) {
      return data;
    } else {
      return dummyData;
    }
  } catch (error: any) {
    console.error('singleData検索エラー:', error);
    return dummyData;
  }
}