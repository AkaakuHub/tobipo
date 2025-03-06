import React, { useEffect, useState } from 'react'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';

import SpotifyColorButton from "../(parts)/SpotifyColorButton";
import LoadingCircleCustom1 from '../(parts)/LoadingCircleCustom1';
import CustomLink from '../(parts)/CustomButton';

import { judgeStatus, fetch_doClientCredentials } from '@/libs/APIhandler';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';

import { accessUrl } from '@/app/login/Spotify';

import GlobalStyle from "@/libs/GlobalStyle";

function Login() {
  // const [randomTobipoResult, setRandomTobipoResult] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDoingClientCredentials, setIsDoingClientCredentials] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  // const createCard = (data: any) => {
  //   return makeMusicCard(data, true);
  // }

  // useEffect(() => {
  //   const getRandomTobipoMusicAPI = async () => {
  //     const res = await fetch_getRandomTobipoMusic(10);
  //     if (judgeStatus(res.status)) {
  //       const json = await res.json();
  //       setRandomTobipoResult(json);
  //     }
  //   }
  //   getRandomTobipoMusicAPI();
  // }, []);

  if (sessionStorage.getItem('error_message')) {
    setErrorMessage(sessionStorage.getItem('error_message') as string);
    sessionStorage.removeItem('error_message');
  }

  const doClientCredentialsAPI = async () => {
    const res = await fetch_doClientCredentials();
    if (judgeStatus(res.status)) {
      const json = await res.json();
      try {
        const token = json.access_token;
        sessionStorage.setItem('temp_token', token);
      }
      catch (error) {
        console.error('Error:', error);
        setErrorMessage("Internal server error");
      }
      // setIsDoingClientCredentials(false);
      // reload
      window
        .location
        .reload();
    }
  }
  // must be here
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };


  return (
    <>
      <GlobalStyle />
      <div className="LoginPage">
        <div className='titleContainer fadein0'
        >
          跳びポHub
        </div>
        <div className='descriptionContainer fadein1'
        >
          <p className='descriptionContent'
          >
            すべての跳びポが、ここにある。
          </p>
          <p className='descriptionContent'
          >
            「跳びポ」とは、おもにアニメやアイドルの曲において、ジャンプしたくなるような部分のことを指す言葉で、ほとんどの場合、音が一瞬だけ止まるような部分が「跳びポ」である。
          </p>
          <p className='descriptionContent'
          >
            あなたもお気に入りの跳びポを見つけよう。
          </p>
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
            style={{ // must be here
              fontSize: '20px',
              fontFamily: 'var(--m-plus-rounded-1c)',
            }}
            href={accessUrl}
          >
            <p className='loginButtonText'
            >
              Spotifyでログイン
            </p>
            <LoginIcon />
          </SpotifyColorButton>
          <SpotifyColorButton
            style={{ // must be here
              fontSize: '20px',
              fontFamily: 'var(--m-plus-rounded-1c)',
            }}
            onClick={() => {
              doClientCredentialsAPI();
              setIsDoingClientCredentials(true);
            }
            }
          >
            <p className='loginButtonText'
            >
              ログインなしで続行
            </p>
            <ArrowForwardIcon />
          </SpotifyColorButton>
        </div>
        {
          /* ログインを不要にした */
        }
        <div className='disclaimerContainer fadein2'
        >
          ※Spotifyでログインすると、ユーザーごとにカスタマイズされた検索結果の表示が可能です。
          <br />
          ログインなしでも利用可能ですが、その場合検索結果のクオリティが低くなることがあります。
          なお、ユーザー名やログイン情報などは一切収集いたしません。
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
          {/* <div className='howtoContent'
        >
          1. Spotifyにログイン
        </div> */}
          <p className='howtoContent'
          >
            1. 検索またはランダムに選んで、お気に入りの跳びポを見つける
          </p>
          <p className='howtoContent'
          >
            2. ツイートボタンでシェア！！
          </p>
        </div>
        <div className='tobipoPlaylistContainer fadein4'
        >
          <h2>参照元のプレイリスト</h2>
          <p className='disclaimerContainer'
          >※本サイトはプレイリスト制作者とは一切関係ありません。</p>
          <iframe src={"https://open.spotify.com/embed/playlist/1evrJkF0lPEDvUa1RlTKJt"}
            width="90%" height="480" frameBorder="0"
            allow="encrypted-media">
          </iframe>
        </div>
        <div className='tobipoPlaylistContainer fadein4'
        >
          <h2>除外プレイリスト</h2>
          <p className='disclaimerContainer'
          >※個人的見解を含みます。</p>
          <iframe src={"https://open.spotify.com/embed/playlist/1nECnLmaLqey4nztKpiayI"}
            width="90%" height="480" frameBorder="0"
            allow="encrypted-media">
          </iframe>
        </div>
        <div className='othersContainer fadein4'>
          最新メンテナンス日: 2024/4/28
          <br />
          (データベースの更新日とは関係ありません)
          <br />
          <span onClick={handleOpen}>
            <CustomLink>
              プライバシーポリシー
            </CustomLink>
          </span>
          <br />
          <br />
          <CustomLink href="https://twitter.com/akaakuhub" target="_blank">
            Akaaku
          </CustomLink>
          &apos;s product
        </div>
        <Modal
          open={isModalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                プライバシーポリシー
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              本サイトでは、ユーザー体験の向上やサイトの最適化のため、Googleアナリティクスを使用しています。
              <br />
              Googleアナリティクスでは、Cookieを使用して、個人を特定できない形で匿名データを収集しています。
              <br />
              もしデータ収集を拒否したい場合は、お使いのブラウザの設定を変更してください。
              <br />
              <br />
              詳しくは、
              <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank">Googleアナリティクス利用規約</a>
              や
              <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank">Googleのポリシーと規約</a>
              をご確認ください。
            </Typography>
          </Box>
        </Modal>
        <LoadingCircleCustom1 loading={isDoingClientCredentials} />
      </div>
    </>
  )
}

export default Login
