const makeMusicCard = (data: any, isTobipo: boolean) => {
  return (
    <div className='music-card' key={data.id}
    >
      {isTobipo
        &&
        <div className='tobipo-icon'
        >跳</div>}
      <div className='info-container'>
        <div className='song_name'// style={{ animationDuration }}
        >{data.name}</div>
        <div className='artist_name' //style={{ animationDuration }}
        >{data.artists[0].name}</div>
      </div>

      <div className='jacket-container'>
        <img src={data.album.images[0].url} alt={data.name} />
      </div>

      <iframe src={`https://open.spotify.com/embed/track/${data.id}`}
        width="350" height="300" frameBorder="0"
        allow="encrypted-media"
        style={{ backgroundColor: 'transparent' }}
      >
      </iframe>
    </div>
  )
}

export default makeMusicCard;