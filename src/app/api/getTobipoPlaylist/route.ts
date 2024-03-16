// getTobipoPlaylist
import { NextRequest } from "next/server";
import axios from 'axios';

import extractTobipoData from '@/libs/ExtractTobipoData';

import { db } from "@/firebase/firebase";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const token: string = requestBody.token;
    const res = await getPlaylist(token);
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

const getPlaylist = async (token: string) => {
  let data;
  try {
    // FirebaseからlastUpdatedを取得
    let lastUpdatedFromFB: string = "";
    const snapshot = await db.ref("tobipoPlaylist/lastUpdated").get();
    lastUpdatedFromFB = snapshot.val();
    console.log('lastUpdatedFromFB:', new Date(lastUpdatedFromFB));

    const lastUpdated: Date = new Date(lastUpdatedFromFB);
    const diffDays: number = Math.ceil(Math.abs(new Date().getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

    // 1日以上経っていたら更新または、tokenがない場合もキャッシュを返す
    if (diffDays <= 1 || token === "") {
      console.log('Using cached tobipo playlist.');
      // Firebaseから登録されている全てのkeyのみを取得
      // const dataFromFB = await db.ref("tobipoPlaylist/items").get();
      const dataFromFB = await db.ref("tobipoPlaylist/idArray").get();
      data = dataFromFB.val();
      // console.log('data:', data);
      return data;
    }
  } catch (error) {
    console.log('No cached tobipo playlist found.');
  }

  try {
    const tobipoPlaylist = process.env.SPOTIFY_TOBIPO_PLAYLIST;
    let response = await axios.get(`https://api.spotify.com/v1/playlists/${tobipoPlaylist}/tracks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': 'ja'
      }
    });
    let items = response.data.items;
    while (response.data.next) {
      response = await axios.get(response.data.next, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': 'ja'
        }
      });
      items = [...items, ...response.data.items];
    }
    console.log('Updated tobipo playlist.');

    // そのままだと不要な情報が多いので、あらかじめ必要な情報だけを抽出
    const extractedItems = extractTobipoData(items, "playlist");
    // Firebaseに保存
    db.ref("tobipoPlaylist/lastUpdated").set(new Date().toString());
    db.ref("tobipoPlaylist/items").set(extractedItems);
    // idだけの配列を作成
    const idArray = Object.keys(extractedItems);
    db.ref("tobipoPlaylist/idArray").set(idArray);
    /** extractedItems
     * {"12345": {...}, "67890": {...}, ...}
     */
    // return extractedItems;
    return idArray;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return {};
    }
    console.error('リスト取得エラー:', error);
  }
}
