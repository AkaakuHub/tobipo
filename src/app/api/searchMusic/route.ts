// searchMusic
import { NextRequest } from "next/server";
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        const token: string = requestBody.token;
        const song_name: string = requestBody.search;
        const res = await searchMusic(song_name, token);
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

const searchMusic = async (search: string, token: string) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            params: {
                q: search,
                type: 'track',
                limit: 50
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': 'ja'
            }
        });
        return response.data.tracks.items;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            return {};
        }
        console.error('検索エラー:', error);
    }
}