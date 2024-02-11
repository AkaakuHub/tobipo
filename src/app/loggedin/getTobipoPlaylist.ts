import axios from 'axios';
import { get } from 'http';

const getPlaylist = async (token: string) => {
    try {
        // SPOTIFY_TOBIPO_PLAYLISTから、プレイリストに入っている曲のそれぞれのトラックIDを取得する
        const tobipoPlaylist = process.env.NEXT_PUBLIC_SPOTIFY_TOBIPO_PLAYLIST;
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${tobipoPlaylist}/tracks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.items;
    } catch (error) {
        console.error('検索エラー:', error);
    }
}

export default getPlaylist;