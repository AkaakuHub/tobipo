import React, { use, useEffect, useState } from 'react'


import { Input } from '@mui/material';
import Cookies from 'js-cookie';

import SpotifyColorButton from './components/SpotifyColorButton';

import { CircularProgress } from '@mui/material';
// ここに、jsonからmuiのカードコンポーネントを作成する関数を作成する

function LoggedIn(props: { token: string }) {
    const [isFetchingTobipoPlaylist, setIsFetchingTobipoPlaylist] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

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
            const res = await fetch("api/getTobipoPlaylist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: props.token })
            });
            if (res.status === 401) {
                console.log('Unauthorized token');
                Cookies.remove('temp_token');
                Cookies.set('error_message', '無効なトークンです', { secure: true })
                window.location.href = '/';
            } else if (res.status === 500) {
                console.log('Internal server error');
                Cookies.remove('temp_token');
                Cookies.set('error_message', 'サーバーエラーです', { secure: true })
                window.location.href = '/';
            } else {
                const data = await res.json();
                // ここからidを取り出す
                extractTobipoData(data);
                setIsFetchingTobipoPlaylist(false);
            }
        }
        fetchPlaylist();
    }, [props.token]);

    return (
        <>
            {isFetchingTobipoPlaylist ?
                (
                    <div className='loading'>
                        <CircularProgress size={100} />
                    </div>
                ) : <>
                    <div>
                        <h1>検索</h1>
                    </div>
                    <div>
                        <Input placeholder="曲名を入力" onChange={e => setSearch(e.target.value)} />
                        <br />
                        <br />
                        <SpotifyColorButton variant="contained" color="primary"
                            style={isSearching ? {
                                backgroundColor: 'gray',
                                cursor: 'not-allowed'
                            } : {}}
                            disabled={isSearching}
                            onClick={async () => {
                                setIsSearching(true);
                                const res = await fetch("api/searchMusic", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ search: search, token: props.token })
                                });

                                if (res.status === 401) {
                                    console.log('Unauthorized token');
                                    Cookies.remove('temp_token');
                                    Cookies.set('error_message', '無効なトークンです', { secure: true })
                                    window.location.href = '/';
                                } else if (res.status === 500) {
                                    console.log('Internal server error');
                                    Cookies.remove('temp_token');
                                    Cookies.set('error_message', 'サーバーエラーです', { secure: true })
                                    window.location.href = '/';
                                } else {
                                    const data = await res.json();
                                    console.log(data);
                                    setResults(data);
                                    setIsSearching(false);
                                }
                            }
                            }>検索</SpotifyColorButton>
                    </div>
                    <div className='music-card-container'>
                        {results ?
                            results.map((result: any) => {
                                return createCard(result)
                            }) :
                            "検索結果はありません"}
                    </div>
                </>
            }
        </>
    )
}
export default LoggedIn