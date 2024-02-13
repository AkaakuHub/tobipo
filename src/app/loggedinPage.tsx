import React, { useEffect, useState } from 'react'


import { Input } from '@mui/material';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ShuffleIcon from '@mui/icons-material/Shuffle';

import SpotifyColorButton from './components/SpotifyColorButton';
import LoadingCircleCustom1 from './components/LoadingCircleCustom1';


import { judgeStatus, fetch_getTobipoPlaylist, fetch_searchMusic, fetch_getRandomTobipoMusic } from './libs/APIhandler';
import makeMusicCard from './libs/MusicCard';
import extractTobipoData from './libs/ExtractTobipoData';

// ここに、jsonからmuiのカードコンポーネントを作成する関数を作成する

function LoggedIn(props: { token: string }) {
  const [isFetchingTobipoPlaylist, setIsFetchingTobipoPlaylist] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [songName, setSongName] = useState("");
  const [searchResult, setSearchResults] = useState([]);

  // const [isRandomTobipoMode, setIsRandomTobipoMode] = useState(false);
  const [randomTobipoResult, setRandomTobipoResult] = useState([]);
  const [randomTobipoInfo, setRandomTobipoInfo] = useState({} as any);

  // const [tobipoIDs, setTobipoIDs] = useState([] as string[]);
  // const [tobipoSongNames, setTobipoSongNames] = useState([] as string[]);
  // const [tobipoArtists, setTobipoArtists] = useState([] as string[]);

  const [tobipoDatawithArray, setTobipoDatawithArray] = useState([] as any[]);

  const [maxMusicCount, setMaxMusicCount] = useState(50);
  // const [tobipoMusicCount, setTobipoMusicCount] = useState(0);

  const createCard = (data: any) => {
    const isTobipo: boolean = tobipoDatawithArray.some((item: any) => item.id === data.id)
      || (tobipoDatawithArray.some((item: any) => item.songName === data.name) && tobipoDatawithArray.some((item: any) => item.artist === data.artists[0].name));
    // 跳びポだけ表示に変更
    if (isTobipo) {
      return makeMusicCard(data, isTobipo);
    }
  }

  useEffect(() => {
    const getTobipoPlaylistAPI = async () => {
      const res = await fetch_getTobipoPlaylist(props.token);
      if (judgeStatus(res.status)) {
        const data = await res.json();
        // ここからidを取り出す
        setTobipoDatawithArray(extractTobipoData(data));

        setIsFetchingTobipoPlaylist(false);
      }
    }
    getTobipoPlaylistAPI();
  }, [props.token]);

  const searchMusicAPI = async () => {
    setIsSearching(true);
    const res = await fetch_searchMusic(songName, props.token, maxMusicCount);
    if (judgeStatus(res.status)) {
      const data = await res.json();
      setSearchResults(data);

      setIsSearching(false);

      setRandomTobipoResult([]);
      setRandomTobipoInfo({});
    }
  };

  const getRandomTobipoMusicAPI = async () => {
    const res = await fetch_getRandomTobipoMusic(1);
    if (judgeStatus(res.status)) {
      const data = await res.json();
      setRandomTobipoResult(data);

      const newInfo = {
        name: data[0].name,
        artist: data[0].artists[0].name,
        url: data[0].external_urls.spotify
      }
      setRandomTobipoInfo(newInfo);
    }
  };

  return (
    <>
      {(
        <div className='LoggedInPage'
        >
          <div>
            <Button variant="contained" color="error"
              style={{
                marginTop: '20px',
                marginLeft: '20px'
              }}
              onClick={() => {
                sessionStorage.removeItem('temp_token');
                window.location.href = '/';
              }}
            >
              <LogoutIcon />
              ログアウト
            </Button>
            <div className='search-container'
            >
              <Input placeholder="曲名、アーティスト名etc..."
                className='search-box'
                style={{
                  color: 'white',
                  width: '300px',
                  fontSize: '20px',
                }}
                onChange={e => setSongName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && songName !== "") {
                    searchMusicAPI();
                  }
                }
                }
              />
            </div>

            {/* 実装予定なし */}
            {/* <div className='set-maxMusicCount-container'>
              <Input
                type='number'
                value={maxMusicCount}
                className='search-box'
                style={{
                  color: 'white',
                  width: '100px',
                  fontSize: '20px',
                  marginLeft: '20px'
                }}
                onChange={e => setMaxMusicCount(parseInt(e.target.value))
                }
              />
            </div> */}

            <div className='search-button-container'
            >
              <SpotifyColorButton variant="contained" color="primary"
                style={isSearching ? {
                  backgroundColor: 'gray',
                  cursor: 'not-allowed'
                } : {}}
                disabled={isSearching}
                onClick={() => {
                  if (songName !== "") {
                    // setTobipoMusicCount(0);
                    searchMusicAPI();
                  } else {
                    setSearchResults([]);
                  }
                }
                }
              >
                <SearchIcon />
                検索
              </SpotifyColorButton>
              <Button variant="contained" color="info"
                style={{ marginLeft: '20px' }}
                onClick={() => {
                  getRandomTobipoMusicAPI();
                }
                }
              >
                <ShuffleIcon />
                ランダムに選ぶ
              </Button>
            </div>
          </div>
          <div className='music-card-container'>
            {Object.keys(randomTobipoResult).length > 0 ?
              <div>
                {
                  randomTobipoResult.map((result: any) => {
                    return createCard(result);
                  })
                }
              </div>
              :
              (Object.keys(searchResult).length > 0 ?
                <>
                  {searchResult.map((result: any) => {
                    return createCard(result);
                  })}
                </>
                :
                <div style={{ color: 'white' }}
                >
                  見つかりませんでした...
                </div>
              )
            }
          </div>
        </div>
      )
      }
      <LoadingCircleCustom1 loading={isFetchingTobipoPlaylist} />
    </>
  )
}
export default LoggedIn