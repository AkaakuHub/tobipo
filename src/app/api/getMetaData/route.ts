// getMetaData

import { NextRequest } from "next/server";

import fs from 'fs';
import path from 'path';

import extractTobipoData from '../../libs/ExtractTobipoData';

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const id: string = requestBody.id;
    const res = await makeMetadataById(id);
    if (Object.keys(res).length === 0) {
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
    const jsonPath = path.join(process.cwd(), 'src/app/_components/tobipoPlaylist.json');
    if (fs.existsSync(jsonPath)) {
      const fileData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      const data = fileData.items;
      const extractedData = extractTobipoData(data);
      const index = extractedData.findIndex((item: any) => item.id === id);
      // id
      if (index !== -1) {
        const target = extractedData[index];
        return {
          songName: target.songName,
          artist: target.artist,
          image640: target.image640,
        };
      }
    }
    const baseURL: string = process.env.NEXT_PUBLIC_BASE_URL || "";
    return {
      songName: "Not found",
      artist: "Not found",
      image640: `${baseURL}/ogp_default.png`,
    };
  } catch (error: any) {
    console.error('検索エラー:', error);
    const baseURL: string = process.env.NEXT_PUBLIC_BASE_URL || "";
    return {
      songName: "Error",
      artist: "Error",
      image640: `${baseURL}/ogp_default.png`,
    };
  }
}