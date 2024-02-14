import React, { useEffect, useState } from 'react'

import { styled } from '@mui/material/styles';

import { Input } from '@mui/material';
import { Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ShuffleIcon from '@mui/icons-material/Shuffle';

import SpotifyColorButton from './components/SpotifyColorButton';
import LoadingCircleCustom1 from './components/LoadingCircleCustom1';

import { judgeStatus, fetch_getTobipoPlaylist, fetch_searchMusic, fetch_getRandomTobipoMusic } from './libs/APIhandler';
import makeMusicCard from './libs/MusicCard';

// ここに、jsonからmuiのカードコンポーネントを作成する関数を作成する

function LoggedIn(props: { token: string }) {
  const [isFetchingTobipoPlaylist, setIsFetchingTobipoPlaylist] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [songName, setSongName] = useState("");
  const [searchResult, setSearchResults] = useState([]);

  // const [isRandomTobipoMode, setIsRandomTobipoMode] = useState(false);
  const [randomTobipoResult, setRandomTobipoResult] = useState([]);
  // const [randomTobipoInfo, setRandomTobipoInfo] = useState({} as any);

  // const [tobipoIDs, setTobipoIDs] = useState([] as string[]);
  // const [tobipoSongNames, setTobipoSongNames] = useState([] as string[]);
  // const [tobipoArtists, setTobipoArtists] = useState([] as string[]);

  const [tobipoDatawithArray, setTobipoDatawithArray] = useState([] as any[]);

  const [maxMusicCount, setMaxMusicCount] = useState(50);
  // const [tobipoMusicCount, setTobipoMusicCount] = useState(0);

  const [showNonTobipo, setShowNonTobipo] = useState(false);

  const createCard = (data: any) => {
    // console.log(data);
    const isTobipo: boolean = tobipoDatawithArray.some((item: any) => item.id === data.id);
    // || (tobipoDatawithArray.some((item: any) => item.songName === data.name) && tobipoDatawithArray.some((item: any) => item.artist === data.artists[0].name));
    // 跳びポだけ表示に変更
    // やっぱ全部表示でいいかも
    // それを切り替えられるようにした
    if (showNonTobipo) {
      return makeMusicCard(data, isTobipo);
    } else {
      if (isTobipo) {
        return makeMusicCard(data, isTobipo);
      }
    }
  }

  useEffect(() => {
    const getTobipoPlaylistAPI = async () => {
      const res = await fetch_getTobipoPlaylist(props.token);
      if (judgeStatus(res.status)) {
        const data = await res.json();
        setTobipoDatawithArray(data);
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
      // setRandomTobipoInfo({});
    }
  };

  const getRandomTobipoMusicAPI = async () => {
    const res = await fetch_getRandomTobipoMusic(1);
    if (judgeStatus(res.status)) {
      const data = await res.json();
      setRandomTobipoResult(data);
    }
  };

  const BigToggle = styled(Switch)({
    width: 80,
    height: 36,
    padding: 0,
    marginRight: 20,
    borderRadius: 20,
    '& .MuiSwitch-switchBase': {
      transition: 'none',
      '&.Mui-checked': {
        transform: 'translateX(44px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#1fdf64',
          borderColor: '#1fdf64',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 36,
      height: 36,
      marginTop: -9,
      marginLeft: -9,
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: '#d32f2f',
    },
  });

  return (
    <>
      {(
        <div className='LoggedInPage'
        >
          <div>
            <Button variant="contained" color="error"
              style={{
                marginTop: '20px',
                marginLeft: '20px',
                fontFamily: 'var(--m-plus-rounded-1c)',
              }}
              onClick={() => {
                sessionStorage.removeItem('temp_token');
                window.location.href = '/';
              }}
            >
              <HomeIcon />
              ホームに戻る
            </Button>
            {/* showNonTobipoを切り替えるトグル追加 */}
            <FormControlLabel
              style={{
                color: 'white',
                fontFamily: 'var(--m-plus-rounded-1c)',
                marginTop: '20px',
                marginLeft: '80px',
              }}
              value="end"
              control={<BigToggle checked={showNonTobipo}
              />}
              label={`跳びポ以外を表示${showNonTobipo ? 'する' : 'しない'}`}
              labelPlacement="end"
              onChange={() => setShowNonTobipo(now => !now)}
            />
            <div className='search-container'
            >
              <Input placeholder="曲名、アーティスト名etc..."
                className='search-box'
                style={{
                  color: 'white',
                  width: '300px',
                  fontSize: '20px',
                  fontFamily: 'var(--m-plus-rounded-1c)',
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
                  cursor: 'not-allowed',
                  fontFamily: 'var(--m-plus-rounded-1c)',
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
                style={{ marginLeft: '20px', fontFamily: 'var(--m-plus-rounded-1c)', }}
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