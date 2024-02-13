import React, { useEffect, useState } from 'react'

import { accessUrl } from "./login/Spotify";
import Cookies from 'js-cookie';
import LoginIcon from '@mui/icons-material/Login';

import SpotifyColorButton from "./components/SpotifyColorButton";
// import LoadingCircleCustom1 from './components/LoadingCircleCustom1';

import { judgeStatus, fetch_getRandomTobipoMusic } from './libs/APIhandler';
// import makeMusicCard from './libs/MusicCard';

function Login() {
  const [randomTobipoResult, setRandomTobipoResult] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // const createCard = (data: any) => {
  //   return makeMusicCard(data, true);
  // }

  useEffect(() => {
    const getRandomTobipoMusicAPI = async () => {
      const res = await fetch_getRandomTobipoMusic(10);
      if (judgeStatus(res.status)) {
        const json = await res.json();
        setRandomTobipoResult(json);
      }
    }
    getRandomTobipoMusicAPI();
  }, []);

  if (Cookies.get('error_message')) {
    setErrorMessage(Cookies.get('error_message') ?? '');
    Cookies.remove('error_message');
  }

  return (
    <div className="LoginPage">
      <div className='titleContainer fadein0'
      >
        跳びポHub
      </div>
      <div className='descriptionContainer fadein1'
      >
        <div className='descriptionContent'
        >
          すべての跳びポが、ここにある。
        </div>
        <div className='descriptionContent'
        >
          「跳びポ」とは、おもにアニメやアイドルの曲において、ジャンプしたくなるような部分のことを指す言葉で、ほとんどの場合、音が一瞬だけ止まるような部分が「跳びポ」である。
        </div>
        <div className='descriptionContent'
        >
          あなたもお気に入りの跳びポを見つけよう。
        </div>
      </div>
      <div>
        {errorMessage !== "" && (
          <div className='descriptionContainer fadein2'
          >
            <div
              className='errorMessage'
            >
              {errorMessage}
            </div>
          </div>

        )}
      </div>
      <div className='loginButtonContainer fadein2'>
        <SpotifyColorButton
          href={accessUrl}
        >
          <LoginIcon />
          Spotifyにログインしてはじめる
        </SpotifyColorButton>
      </div>
      <div className='disclaimerContainer fadein2'
      >
        ※本サイトはSpotifyのデータベースを使用するため、ログインが必要となります。<br />
        ユーザー名やログイン情報などは一切収集いたしません。
      </div>

      {/* やりたかったけど重すぎるのでボツ */}
      {/* <div className='tobipo-card-container'>
        {Object.keys(randomTobipoResult).length > 0 ?
          <div>
            {
              randomTobipoResult.map((result: any) => {
                return createCard(result);
              })
            }
          </div>
          :
          <LoadingCircleCustom1 loading={Object.keys(randomTobipoResult).length > 0} />
        }
      </div> */}

      <div className='howtoContainer fadein3'
      >
        <h2>使い方</h2>
        <div className='howtoContent'
        >
          1. Spotifyにログイン
        </div>
        <div className='howtoContent'
        >
          2. 検索またはランダムに選んで、お気に入りの跳びポを見つける
        </div>
        <div className='howtoContent'
        >
          3. ツイートボタンでシェア！！
        </div>
      </div>
      <div className='tobipoPlaylistContainer fadein4'
      >
        <h2>参照元のプレイリスト</h2>
        <div className='disclaimerContainer'
        >※本サイトはプレイリスト制作者とは一切関係ありません。</div>
        <iframe src={"https://open.spotify.com/embed/playlist/1evrJkF0lPEDvUa1RlTKJt"}
          width="90%" height="480" frameBorder="0"
          allow="encrypted-media">
        </iframe>
      </div>
    </div>
  )
}

export default Login
