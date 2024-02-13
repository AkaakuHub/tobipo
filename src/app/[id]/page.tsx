"use client";

import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useEffect, useState } from 'react';
import { fetch_getTobipoPlaylist, judgeStatus } from '../libs/APIhandler';

import LoadingCircleCustom1 from '../components/LoadingCircleCustom1';

import extractTobipoData from '../libs/ExtractTobipoData';

function Page({ params }: { params: { id: string } }) {
  const [isFetchingTobipoPlaylist, setIsFetchingTobipoPlaylist] = useState(true);
  const [tobipoDatawithArray, setTobipoDatawithArray] = useState([] as any[]);

  const [musicInfo, setMusicInfo] = useState({ songName: "", artist: "" });
  useEffect(() => {
    const getTobipoPlaylistAPI = async () => {
      const res = await fetch_getTobipoPlaylist("");
      if (judgeStatus(res.status)) {
        const data = await res.json();
        // ここからidを取り出す
        setTobipoDatawithArray(extractTobipoData(data));
        setIsFetchingTobipoPlaylist(false);
      }
    }
    getTobipoPlaylistAPI();
  }, []);

  useEffect(() => {
    if (!isFetchingTobipoPlaylist) {
      const [songName, artist] = searchMusicByID(params.id);
      setMusicInfo({ songName: songName, artist: artist });
      console.log(songName, artist);
    }
  }, [isFetchingTobipoPlaylist]);

  const searchMusicByID = (id: string) => {
    const index = tobipoDatawithArray.findIndex((item: any) => item.id === id);
    return [tobipoDatawithArray[index].songName, tobipoDatawithArray[index].artist];
  }


  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        style={{
          marginLeft: '20px', color: 'white',
          border: '1px solid white',
        }}
        onClick={() => {
          window.location.href = '../';
        }
        }
      >
        <ArrowBackIcon
        />戻る
      </Button>
      <div className='iframeSoloContainer'
      >
        <iframe src={`https://open.spotify.com/embed/track/${params.id}`}
          allow="encrypted-media"
          frameBorder={0}
          style={{ backgroundColor: 'transparent' }}
          className='iframeSolo'
        >
        </iframe>
      </div>
      <LoadingCircleCustom1 loading={isFetchingTobipoPlaylist} />
    </>
  )
}

export default Page