import React, { useEffect, useState } from 'react'


import { Input } from '@mui/material';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import TwitterIcon from '@mui/icons-material/Twitter';

import Cookies from 'js-cookie';

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
  const [randomTobipoInfo, setRandomTobipoInfo] = useState({} as any);

  const [tobipoIDs, setTobipoIDs] = useState([] as string[]);
  const [tobipoSongNames, setTobipoSongNames] = useState([] as string[]);
  const [tobipoArtists, setTobipoArtists] = useState([] as string[]);

  const createCard = (data: any) => {
    const isTobipo: boolean = tobipoIDs.includes(data.id)
      || (tobipoSongNames.includes(data.name) && tobipoArtists.includes(data.artists[0].name));
    return makeMusicCard(data, isTobipo);
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
    const getTobipoPlaylistAPI = async () => {
      const res = await fetch_getTobipoPlaylist(props.token);
      if (judgeStatus(res.status)) {
        const data = await res.json();
        // ここからidを取り出す
        extractTobipoData(data);
        setIsFetchingTobipoPlaylist(false);
      }
    }
    getTobipoPlaylistAPI();
  }, [props.token]);

  const searchMusicAPI = async () => {
    setIsSearching(true);
    const res = await fetch_searchMusic(songName, props.token);
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

  const makeTweet = () => {
    //const this_site_url: string = process.env.NEXT_PUBLIC_THIS_SITE_URL as string;
    const name: string = randomTobipoInfo.name;
    const artist: string = randomTobipoInfo.artist;
    const url: string = randomTobipoInfo.url; //+ "\n" + this_site_url;
    let tweetText: string = `${name} - ${artist}を跳びポHubで発見しました！\n#跳びポHub #跳びポ\n`
    while (tweetText.length > 140) {
      tweetText = tweetText.slice(0, -1);
    }
    const tweetUrl: string = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweetText) + "&url=" + encodeURIComponent(url);
    window.open(tweetUrl, '_blank');
  }

  return (
    <>
      {(
        <>
          <div>
            <Button variant="contained" color="error"
              style={{ marginLeft: '20px' }}
              onClick={() => {
                Cookies.remove('temp_token');
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
                <div className='TwitterButtonContainer'
                >
                  <TwitterIcon style={{
                    color: 'white',
                    fontSize: '60px',
                    cursor: 'pointer'
                  }}
                    onClick={() => makeTweet()}
                  />
                </div>
              </div>
              :
              (Object.keys(searchResult).length > 0 ?
                searchResult.map((result: any) => {
                  return createCard(result);
                }) :
                <div style={{ color: 'white' }}
                >
                  検索結果はありません。
                </div>
              )
            }
          </div>
        </>
      )
      }
      <LoadingCircleCustom1 loading={isFetchingTobipoPlaylist} />
    </>
  )
}
export default LoggedIn