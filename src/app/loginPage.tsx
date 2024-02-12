import React, { useEffect, useState } from 'react'

import { accessUrl } from "./login/Spotify";

import LoginIcon from '@mui/icons-material/Login';

import SpotifyColorButton from "./components/SpotifyColorButton";
import LoadingCircleCustom1 from './components/LoadingCircleCustom1';

import { judgeStatus, fetch_getRandomTobipoMusic } from './libs/APIhandler';
import makeMusicCard from './libs/MusicCard';

function Login() {
  const [randomTobipoResult, setRandomTobipoResult] = useState([]);

  const createCard = (data: any) => {
    return makeMusicCard(data, true);
  }

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

  return (
    <div className="LoginPage">
      <div className='titleContainer'
      >
        跳びポHub
      </div>
      <div className='descriptionContainer'
      >
        <div className='descriptionContent'
        >
          すべての跳びポが、ここにある。
        </div>
        <div className='descriptionContent'
        >
          「跳びポ」とは、特にアニメやアイドルの曲の中で、ジャンプしたくなるような部分のことを指す言葉で、ほとんどの場合音が一瞬だけ止まるような部分が「跳びポ」である。
        </div>
      </div>
      <div className='loginButtonContainer'>
        <SpotifyColorButton
          href={accessUrl}
        >
          <LoginIcon />
          Spotifyにログインしてはじめる
        </SpotifyColorButton>
      </div>
      <div className='disclaimerContainer'
      >
        ※本サイトはSpotifyのAPIを使用するためSpotifyのアカウントが必要となります。<br />
        なお、ログイン情報などは一切収集いたしません。
      </div>

      <div className='tobipo-card-container'>
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
      </div>

      <div className='tobipoPlaylistContainer'
      >
        <h3>使用しているプレイリスト</h3>
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

