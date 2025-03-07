"use client";

// import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from 'next/navigation';
// import HomeIcon from '@mui/icons-material/Home';

function Page() {
  // const [isVerified, setIsVerified] = useState(false);
  // useEffect(() => {
  //   const token = sessionStorage.getItem('temp_token');
  //   setIsVerified(!!token);
  // }, []);

  const params = useParams<{ id: string }>();
  const songID = params.id;

  return (
    <div>
      <Button
        variant="outlined"
        color="secondary"
        style={{
          marginTop: '20px',
          marginLeft: '20px', color: 'white',
          border: '1px solid white',
          fontSize: '1.2rem',
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
        <iframe src={`https://open.spotify.com/embed/track/${songID}`}
          allow="encrypted-media"
          frameBorder={0}
          style={{ backgroundColor: 'transparent' }}
          className='iframeSolo'
        >
        </iframe>
      </div>
    </div>
  )
}

export default Page