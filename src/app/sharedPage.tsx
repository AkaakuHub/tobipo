import { judgeStatus, fetch_searchTobipoMusicById } from './libs/APIhandler';

function Shared(props: { id: string }) {
  return (
    // cachedjsonから該当するspotifyの曲を取得
    <div>
      {props.id}はログインしています
    </div>
  )
}

export default Shared;