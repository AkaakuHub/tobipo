// getTobipoPlaylist
import { NextRequest } from "next/server";
import axios from 'axios';

import extractTobipoData from '@/libs/ExtractTobipoData';

import { db } from "@/firebase/firebase";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const token: string = requestBody.token;
    const kind: string = requestBody.kind;
    const res = await getPlaylist(token, kind);
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

const getPlaylist = async (token: string, kind: string) => {
  switch (kind) {
    case "first":
      try {
        let isUpToDate: boolean = false;
        // FirebaseからlastUpdatedを取得
        let lastUpdatedFromFB: string = "";
        const snapshot = await db.ref("tobipoPlaylist/lastUpdated").get();
        lastUpdatedFromFB = snapshot.val();
        console.log('lastUpdatedFromFB:', new Date(lastUpdatedFromFB));

        const lastUpdated: Date = new Date(lastUpdatedFromFB);
        const diffDays: number = Math.ceil(Math.abs(new Date().getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

        // 1日以上経っていたら更新または、tokenがない場合もキャッシュを返す
        // レスポンス改善のため、一回目はキャッシュを返す
        if (diffDays <= 1 || token === "") {
          isUpToDate = true;
        }
        console.log('Using cached tobipo playlist.');

        const idArrayFromFB = await db.ref("tobipoPlaylist/idArray").get();
        const excludedIdArrayFromFB = await db.ref("tobipoPlaylist/excludedIdArray").get();
        const idArray = idArrayFromFB.val();
        const excludedIdArray = excludedIdArrayFromFB.val();

        // ここから、dataを作成, excludedIdArrayを使って、idArrayから除外
        const data: string[] = idArray.filter((id: string) => !excludedIdArray.includes(id));

        return {
          isUpToDate: isUpToDate,
          data: data
        }
      } catch (error) {
        console.log('No cached tobipo playlist found.');
        return await callAPI(token);
      }
    case "second":
      return await callAPI(token);
  }
}

const callAPI = async (token: string) => {
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

    const tobipoExcludePlaylist = process.env.SPOTIFY_TOBIPO_EXCLUDE_PLAYLIST;
    let response2 = await axios.get(`https://api.spotify.com/v1/playlists/${tobipoExcludePlaylist}/tracks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': 'ja'
      }
    });
    let items2 = response2.data.items;
    while (response2.data.next) {
      response2 = await axios.get(response2.data.next, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': 'ja'
        }
      });
      items2 = [...items2, ...response2.data.items];
    }

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

    // 除外リストを作成
    const extractedItems2 = extractTobipoData(items2, "playlist");
    const idArray2 = Object.keys(extractedItems2);
    // 除外idArrayをFirebaseに保存
    db.ref("tobipoPlaylist/excludedIdArray").set(idArray2);

    console.log('Updated tobipo playlist.');
    return idArray;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return {};
    }
    console.error('リスト取得エラー:', error);
  }
}