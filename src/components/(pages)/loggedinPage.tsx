import React, { useEffect, useState } from 'react'

import { TobipoData } from "@/app/types";
import { styled } from '@mui/material/styles';

import { Input, useRadioGroup } from '@mui/material';
import { Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ShuffleIcon from '@mui/icons-material/Shuffle';

import SpotifyColorButton from '../(parts)/SpotifyColorButton';
import LoadingCircleCustom1 from '../(parts)/LoadingCircleCustom1';

import { judgeStatus, fetch_getTobipoPlaylist, fetch_searchMusic, fetch_getSingleData } from "@/libs/APIhandler";
import makeMusicCard from "@/libs/MusicCard";

import GlobalStyle from "@/libs/GlobalStyle";

function LoggedIn(props: { token: string }) {
  const [isFetchingTobipoPlaylist, setIsFetchingTobipoPlaylist] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isGettingRandomTobipo, setIsGettingRandomTobipo] = useState<boolean>(false);

  const [songName, setSongName] = useState<string>("");
  const [searchResult, setSearchResults] = useState<{ [key: string]: TobipoData }>({}); // 複数
  const [randomTobipoResult, setRandomTobipoResult] = useState<{ [key: string]: TobipoData }>({}); // 1つだけ

  const [tobipoOnlyIDArray, setTobipoOnlyIDArray] = useState<string[]>([]);
  const [tobipoDataObject, setTobipoDataObject] = useState<{ [key: string]: TobipoData }>({});
  const [maxMusicCount, setMaxMusicCount] = useState<number>(50);
  // const [tobipoMusicCount, setTobipoMusicCount] = useState(0);

  const [showNonTobipo, setShowNonTobipo] = useState<boolean>(false);

  const [isDBupToDate, setIsDBupToDate] = useState<boolean>(true);

  const createCard = (id: string, data: TobipoData) => {
    const isTobipo: boolean = tobipoOnlyIDArray.includes(id);
    // || (tobipoDataObject.some((item: any) => item.songName === data.name) && tobipoDataObject.some((item: any) => item.artist === data.artists[0].name));
    // 跳びポだけ表示に変更
    // やっぱ全部表示でいいかも
    // それを切り替えられるようにした
    if (showNonTobipo) {
      return makeMusicCard(id, data, isTobipo);
    } else {
      if (isTobipo) {
        return makeMusicCard(id, data, isTobipo);
      }
    }
  }

  const searchMusicAPI = async () => {
    setIsSearching(true);
    const res = await fetch_searchMusic(songName, props.token, maxMusicCount);
    if (judgeStatus(res.status)) {
      const data = await res.json();
      setSearchResults(data);
      setIsSearching(false);
      setRandomTobipoResult({});
    }
  };

  useEffect(() => {
    const fetchTobipoPlaylist: () => void = async () => {
      try {
        setIsFetchingTobipoPlaylist(true);
        const res = await fetch_getTobipoPlaylist(props.token, "first");
        if (judgeStatus(res.status)) {
          const json = await res.json();
          const isUpToDate: boolean = json.isUpToDate;
          const data: string[] = json.data;
          setIsDBupToDate(isUpToDate);
          setTobipoOnlyIDArray(data);
          initializeTobipoDataObject(data);
        }
      } catch (error) {
        console.error('Error fetching Tobipo playlist:', error);
      } finally {
        setIsFetchingTobipoPlaylist(false);
      }
    };

    fetchTobipoPlaylist();
  }, [props.token]);

  // isDBupToDateがfalseならAPIを叩く
  // 非同期で最新データを取得して勝手に更新しておく
  useEffect(() => {
    const updateFunc = async () => {
      const res = await fetch_getTobipoPlaylist(props.token, "second");
      if (judgeStatus(res.status)) {
        const data = await res.json();
        setTobipoOnlyIDArray(data);
        initializeTobipoDataObject(data);
      }
    }
    if (!isDBupToDate) {
      updateFunc();
    }
  }, [isDBupToDate, props.token]);

  const initializeTobipoDataObject = async (tobipoOnlyIDArray: string[]) => {
    const initialTobipoDataObject: { [key: string]: TobipoData } = {};
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * tobipoOnlyIDArray.length);
      const id = tobipoOnlyIDArray[randomIndex];
      const res = await fetch_getSingleData(id);
      if (judgeStatus(res.status)) {
        const data = await res.json();
        initialTobipoDataObject[id] = data;
      }
    }
    // console.log('initialTobipoDataObject:', initialTobipoDataObject);
    setTobipoDataObject(initialTobipoDataObject);
  }


  // 既存の getRandomTobipoMusicAPI 関数を分割
  const getRandomTobipoMusicAPI = async () => {
    setIsGettingRandomTobipo(true);

    // tobipoDataObjectからランダムに1つ選ぶ
    const keys = Object.keys(tobipoDataObject);
    if (keys.length === 0) {
      // tobipoDataObjectが空の場合は何もしない
      setIsGettingRandomTobipo(false);
      return;
    }
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomTobipo: TobipoData = tobipoDataObject[randomKey];

    // 選んだものをtobipoDataObjectから削除する
    const newTobipoDataObject = { ...tobipoDataObject };
    delete newTobipoDataObject[randomKey];

    // randomTobipoResultに設定する
    setRandomTobipoResult({ [randomKey]: randomTobipo });

    // tobipoDataObjectを更新する
    setTobipoDataObject(newTobipoDataObject);
  };

  // useEffect フックを追加
  useEffect(() => {
    const fetchData = async () => {
      if (tobipoOnlyIDArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * tobipoOnlyIDArray.length);
        const id = tobipoOnlyIDArray[randomIndex];
        const res = await fetch_getSingleData(id);
        if (judgeStatus(res.status)) {
          const data = await res.json();
          setTobipoDataObject(prevTobipoDataObject => ({
            ...prevTobipoDataObject,
            [id]: data
          }));
        }
      }
      setIsGettingRandomTobipo(false);
    };

    if (isGettingRandomTobipo) {
      fetchData();
    }
  }, [isGettingRandomTobipo, tobipoOnlyIDArray]);


  // トグルのスタイル
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
      <GlobalStyle />
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
                style={{
                  fontFamily: 'var(--m-plus-rounded-1c)',
                  ...(isSearching && {
                    backgroundColor: 'gray',
                    cursor: 'not-allowed',
                  }),
                }}
                disabled={isSearching}
                onClick={() => {
                  if (songName !== "") {
                    // setTobipoMusicCount(0);
                    searchMusicAPI();
                  } else {
                    setSearchResults({});
                  }
                }
                }
              >
                <SearchIcon />
                検索
              </SpotifyColorButton>
              <Button
                variant="contained"
                color="info"
                style={{
                  marginLeft: '20px',
                  fontFamily: 'var(--m-plus-rounded-1c)',
                  ...(isGettingRandomTobipo && {
                    backgroundColor: 'gray',
                    cursor: 'not-allowed',
                  }),
                }}
                disabled={isGettingRandomTobipo}
                onClick={getRandomTobipoMusicAPI}
              >
                <ShuffleIcon />
                ランダムに選ぶ
              </Button>
            </div>
          </div>
          <div className='music-card-container'>
            {Object.keys(randomTobipoResult).length > 0 ?
              <>
                {
                  Object.keys(randomTobipoResult).map((key: string) => {
                    return createCard(key, randomTobipoResult[key]);
                  })
                }
              </>
              :
              (Object.keys(searchResult).length > 0 ?
                <>
                  {
                    Object.keys(searchResult).map((key: string) => {
                      return createCard(key, searchResult[key]);
                    })
                  }
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
      {
        isFetchingTobipoPlaylist && (
          <div className='fetchingTobipoPlaylistMsg'
          >
            データを取得中です。しばらくお待ちください。
          </div>
        )
      }
    </>
  )
}
export default LoggedIn