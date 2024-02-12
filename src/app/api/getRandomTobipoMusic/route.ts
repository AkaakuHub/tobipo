// getRandomTobipoMusic
import { NextRequest } from "next/server";
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        const numOfTracks: number = requestBody.numOfTracks;
        // このnum分だけ、chacedのplaylistからランダムに選ぶ
        const res = await getRandomTobipoMusic(numOfTracks);
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

const getRandomTobipoMusic = async (numOfTracks: number) => {
    const jsonPath = path.join(process.cwd(), 'src/app/_components/tobipoPlaylist.json');
    try {
        const data = fs.readFileSync(jsonPath, 'utf-8');
        // ここで、numOfTracks分だけランダムに選ぶ
        const items = JSON.parse(data).items;
        const itemsLength = items.length;
        const randomNums = new Set<number>();
        while (randomNums.size < numOfTracks) {
            randomNums.add(Math.floor(Math.random() * itemsLength));
        }
        const selectedItems = Array.from(randomNums).map((num) => items[num].track);
        return selectedItems;
    } catch (error: any) {
        console.error('検索エラー:', error);
        return [];
    }
}