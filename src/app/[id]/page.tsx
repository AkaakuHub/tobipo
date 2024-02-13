"use client";

import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Page({ params }: { params: { id: string } }) {
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
          frameBorder="0"
          allow="encrypted-media"
          style={{ backgroundColor: 'transparent' }}
          className='iframeSolo'
        >
        </iframe>
      </div>

    </>
  )
}

export default Page