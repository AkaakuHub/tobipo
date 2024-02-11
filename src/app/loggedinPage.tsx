import React, { use, useEffect, useState } from 'react'
import { Button } from "@mui/material";
import { Input } from '@mui/material';
import searchMusic from './loggedin/searchMusic';
// ここに、jsonからmuiのカードコンポーネントを作成する関数を作成する

function LoggedIn(props: { token: string }) {
    const [isFetchingTobipos, setIsFetchingTobipos] = useState(true);

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    const [tobipoPlaylist, setTobipoPlaylist] = useState([]);
    const [tobipoIDs, setTobipoIDs] = useState([] as string[]);

    const [tobipoSongNames, setTobipoSongNames] = useState([] as string[]);
    const [tobipoArtists, setTobipoArtists] = useState([] as string[]);

    // 右側にはみ出ている分が完全に窓に入るまではひだりにスクロールする、はいったら右にスクロールするの繰り返し
    // const animationDuration = 

    const createCard = (data: any) => {
        return (
            <div className='music-card' key={data.id}
            >{/* && tobipoArtists.includes(data.artists[0].name) */}
                {(tobipoIDs.includes(data.id)
                    || (tobipoSongNames.includes(data.name))
                )
                    &&
                    <div className='tobipo-icon'
                    >跳</div>}
                <div className='info-container'>
                    <div className='song_name'// style={{ animationDuration }}
                    >{data.name}</div>
                    <div className='artist_name' //style={{ animationDuration }}
                    >{data.artists[0].name}</div>
                </div>

                <div className='jacket-container'>
                    <img src={data.album.images[0].url} alt={data.name} />
                </div>

                {/* embed builder */}
                <iframe src={`https://open.spotify.com/embed/track/${data.id}`}
                    width="350" height="300" frameBorder="0"
                    allow="encrypted-media"
                    style={{ backgroundColor: 'transparent' }}
                >
                </iframe>
            </div>
        )
    }

    const extractTobipoData = (data: any) => {
        const newTobipoData = data.map((item: any) => {
            return {
                id: item.track.id,
                songName: item.track.name,
                artist: item.track.artists[0].name
            };
        });

        const tobipoIDsArray = newTobipoData.map((item: any) => item.id);
        const tobipoSongNamesArray = newTobipoData.map((item: any) => item.songName);
        const tobipoArtistsArray = newTobipoData.map((item: any) => item.artist);

        setTobipoIDs(tobipoIDsArray);
        setTobipoSongNames(tobipoSongNamesArray);
        setTobipoArtists(tobipoArtistsArray);
    }

    useEffect(() => {
        const fetchPlaylist = async () => {
            // api/getTobipoPlaylistにトークンを送って、プレイリストを取得する
            const res = await fetch("api/getTobipoPlaylist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: props.token })
            })
                .then(res => res.json())
                .then(res => res)
                .catch(err => console.error(err));

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