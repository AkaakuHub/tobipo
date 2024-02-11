import axios from 'axios';

const searchMusic = async (search: string, token: string) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            params: {
                q: search,
                type: 'track',
                limit: 10
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.tracks.items;
    } catch (error) {
        console.error('検索エラー:', error);
    }
}

export default searchMusic;