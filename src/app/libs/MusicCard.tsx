import React, { useEffect, useState, useRef } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import TwitterIcon from '@mui/icons-material/Twitter';
import CircularProgress from '@mui/material/CircularProgress';

// import Image from 'next/image';

const makeTweet = (name: string, artist: string, id: string) => {
  const this_site_url: string = process.env.NEXT_PUBLIC_BASE_URL as string;
  let tweetText: string = `${name} - ${artist}を跳びポHubで発見しました！\n#跳びポHub #跳びポ\n`
  while (tweetText.length > 140) {
    tweetText = tweetText.slice(0, -1);
  }
  const newURL: string = this_site_url + "/" + id;
  const tweetUrl: string = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweetText) + "&url=" + encodeURIComponent(newURL);
  window.open(tweetUrl, '_blank');
}

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const maxTime: number = 28800;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [remainingTime, setRemainingTime] = useState(maxTime);
  const [baseTime, setBaseTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setRemainingTime((prev) => prev - 100);
        setBaseTime(Date.now());
      }
    }, 100);
    if (isPausing) {
      const micros = Date.now() - baseTime;
      setRemainingTime((prev) => prev - micros);
      setIsPausing(false);
    }
    // console.log(remainingTime);
    if (remainingTime <= 0) {
      setIsPlaying(false);
      setRemainingTime(maxTime);
    }
    return () => clearInterval(interval);
  }, [isPlaying, remainingTime, isPausing, baseTime]);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsPausing(true);
      }
    }
  };

  const progress: number = (remainingTime / maxTime) * 100;

  return (
    <>
      <div className='demo-play-container'
      >
        {isPlaying ? (
          <PauseCircleIcon onClick={handlePlayAudio} className='demo-play-button' style={{ fontSize: '60px' }} />
        ) : (
          <PlayCircleIcon onClick={handlePlayAudio} className='demo-play-button' style={{ fontSize: '60px' }} />
        )}
        <audio ref={audioRef} src={src} />
      </div>
      <div className='progress-container'
      >
        <CircularProgress
          style={{ color: '#1fdf64' }}
          size={60}
          thickness={5}
          variant="determinate" value={100 - progress} />
      </div>
    </>

  );
};

const makeMusicCard = (data: any, isTobipo: boolean) => {
  return (
    <div
      className=
      {isTobipo ? 'music-card tobipo-frame' : 'music-card'}
      key={data.id}
    >

      {isTobipo
        &&
        <div className='tobipo-icon'
        >跳</div>}
      <div className='info-container'>
        <div className='song_name'
        >{data.songName}</div>
        <div className='artist_name'
        >{data.artist}</div>
      </div>
      <a className="music-card-href"
        href={isTobipo ? `./${data.id}` : data.external_urls_spotify}
        target={isTobipo ? "_self" : "_blank"}
      >
        <div className='jacket-container'>
          <img src={data.image640_url} alt={data.songName}
          />
        </div>
      </a>
      <AudioPlayer src={data.preview_url} />
      {isTobipo &&
        <div className='TwitterButtonContainer'
        >
          <TwitterIcon style={{
            fontSize: '44px',
            cursor: 'pointer'
          }}
            className='TwitterButton'
            onClick={() => makeTweet(data.songName, data.artist, data.id)}
          />
        </div>
      }

    </div>
  )
}

export default makeMusicCard;