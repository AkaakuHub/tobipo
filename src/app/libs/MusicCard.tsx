import React, { useEffect, useState, useRef } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className='demo-play-container'
    >
      {isPlaying ? (
        <PauseCircleIcon onClick={handlePlayAudio} className='demo-play-button' style={{ fontSize: '60px' }} />
      ) : (
        <PlayCircleIcon onClick={handlePlayAudio} className='demo-play-button' style={{ fontSize: '60px' }} />
      )}
      <audio ref={audioRef} src={src} />
    </div>
  );
};

const makeMusicCard = (data: any, isTobipo: boolean) => {
  return (
    <div
      className=
      {isTobipo ? 'music-card tobipo-frame' : 'music-card'}
      key={data.id}
    >
      <a className="music-card-href"
        href={data.external_urls.spotify} target="_blank">
        {isTobipo
          &&
          <div className='tobipo-icon'
          >跳</div>}
        <div className='info-container'>
          <div className='song_name'
          >{data.name}</div>
          <div className='artist_name'
          >{data.artists[0].name}</div>
        </div>
        <div className='jacket-container'>
          <img src={data.album.images[0].url} alt={data.name} />
        </div>
        {/* 重いからなしで */}
        {/* <iframe src={`https://open.spotify.com/embed/track/${data.id}`}
        width="350" height="300" frameBorder="0"
        allow="encrypted-media"
        style={{ backgroundColor: 'transparent' }}
      >
      </iframe> */}
      </a>
      <AudioPlayer src={data.preview_url} />
    </div>
  )
}

export default makeMusicCard;