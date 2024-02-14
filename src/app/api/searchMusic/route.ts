// searchMusic
import { NextRequest } from "next/server";
import axios from 'axios';

import extractTobipoData from '../../libs/ExtractTobipoData';

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        const token: string = requestBody.token;
        const song_name: string = requestBody.search;
        const maxMusicCount: number = requestBody.maxMusicCount;
        const res = await searchMusic(song_name, token, maxMusicCount);
        // console.log(res);
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

const searchMusic = async (search: string, token: string, maxMusicCount: number) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            params: {
                q: search,
                type: 'track',
                limit: maxMusicCount
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': 'ja'
            }
        });
        const data = response.data.tracks.items;
        const extractedItem = extractTobipoData(data, "search");
        return extractedItem;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            return {};
        }
        console.error('検索エラー:', error);
        // はじめの500文字だけ表示
        // console.error('検索エラー:', error.message.substring(0, 500));
    }
}