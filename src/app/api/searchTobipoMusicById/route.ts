// searchTobipoMusicById

import { NextRequest } from "next/server";
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        const id: string = requestBody.id;
        const res = await searchTobipoMusicById(id);
        // console.log(res);
        if (Object.keys(res).length === 0) {
            return new Response('Internal server error', { status: 500 });
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

const searchTobipoMusicById = async (id: string) => {
    const jsonPath = path.join(process.cwd(), 'src/app/_components/tobipoPlaylist.json');
    try {
        const data = fs.readFileSync(jsonPath, 'utf-8');
        const items = JSON.parse(data).items;
        const itemsLength = items.length;
        for (let i = 0; i < itemsLength; i++) {
          if (items[i].id === id){
            return items[i].track;
          }
        }
        return [];
    } catch (error: any) {
        console.error('検索エラー:', error);
        return [];
    }
}