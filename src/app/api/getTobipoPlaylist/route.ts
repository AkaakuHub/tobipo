// getTobipoPlaylist
import { NextRequest } from "next/server";
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        const token: string = requestBody.token;
        const res = await getPlaylist(token);
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

const getPlaylist = async (token: string) => {
    const jsonPath = path.join(process.cwd(), 'src/app/_components/tobipoPlaylist.json');
    let data;

    if (fs.existsSync(jsonPath)) {
        const fileData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const lastUpdated: Date = new Date(fileData.lastUpdated);
        const diffDays: number = Math.ceil(Math.abs(new Date().getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

        // console.log(diffDays);
        // 1日以上経っていたら更新または、tokenがない場合もキャッシュを返す
        if (diffDays <= 1 || token === "") {
            console.log('Using cached tobipo playlist.');
            return fileData.items;
        }
    } else {
        console.log('No cached tobipo playlist found.');
    }

    try {
        const tobipoPlaylist = process.env.NEXT_PUBLIC_SPOTIFY_TOBIPO_PLAYLIST;
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
        // console.log("nums of tracks:", items.length);
        //1000ほどあるはず
        data = {
            lastUpdated: new Date(),
            items
        };
        console.log('Updated tobipo playlist.');
        fs.writeFileSync(jsonPath, JSON.stringify(data));
        return items;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            return {};
        }
        console.error('検索エラー:', error);
    }
}