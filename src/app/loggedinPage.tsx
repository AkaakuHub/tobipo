import React, { use, useEffect, useState } from 'react'
import { Button } from "@mui/material";
import { Input } from '@mui/material';
import searchMusic from './loggedin/searchMusic';
import getTobipoPlaylist from './loggedin/getTobipoPlaylist';

// ここに、jsonからmuiのカードコンポーネントを作成する関数を作成する

function LoggedIn(props: { token: string }) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    const [tobipoPlaylist, setTobipoPlaylist] = useState([]);
    const [tobipoIDs, setTobipoIDs] = useState([] as string[]);

    const [tobipoSongNames, setTobipoSongNames] = useState([] as string[]);
    const [tobipoArtists, setTobipoArtists] = useState([] as string[]);

    const createCard = (data: any) => {
        return (
            <div className='music-card' key={data.id}
            >
                {(tobipoIDs.includes(data.id)
                    || (tobipoSongNames.includes(data.name) && tobipoArtists.includes(data.artists[0].name))
                )
                    &&
                    <div className='tobipo-icon'
                    >跳</div>}
                {/* <div className='song_name'>{data.name}</div> */}
                {/* <div className='artist_name'>{data.artists[0].name}</div> */}
                {/* <div className='jacket-container'>
                        <img src={data.album.images[0].url} alt={data.name} />
                    </div>
     */}
                {/* embed builder */}
                <iframe src={`https://open.spotify.com/embed/track/${data.id}`}
                    width="350" height="300" frameBorder="0" allowTransparency={true}
                    allow="encrypted-media">
                </iframe>
            </div>
        )
    }

    const extractTobipoData = (data: any) => {
        for (let i = 0; i < data.length; i++) {
            setTobipoIDs((prev: any) => [...prev, data[i].track.id])
            setTobipoSongNames((prev: any) => [...prev, data[i].track.name])
            setTobipoArtists((prev: any) => [...prev, data[i].track.artists[0].name])
        }
    }


    useEffect(() => {
        const fetchPlaylist = async () => {
            const res = await getTobipoPlaylist(props.token);
            setTobipoPlaylist(res);
            // ここからidを取り出す
            extractTobipoData(res);
        }
        fetchPlaylist();
    }, [props.token])

    return (
        <>
            <div>
                <h1>検索</h1>
            </div>
            <div>
                <Input placeholder="曲名を入力" onChange={e => setSearch(e.target.value)} />
                <br />
                <br />
                <Button variant="contained" color="primary"
                    onClick={async () => {
                        const res = await searchMusic(search, props.token);
                        setResults(res)
                    }
                    }>検索</Button>
            </div>
            <div className='music-card-container'>
                {results ?
                    results.map((result: any) => {
                        return createCard(result)
                    }) :
                    "検索結果はありません"}
            </div>
        </>
    )
}

export default LoggedIn