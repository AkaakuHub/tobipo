import { TobipoData } from '../types';

const extractTobipoData = (data: any, kind: string) => {
  let newTobipoData: TobipoData[] = [];
  switch (kind) {
    case "playlist":
      newTobipoData = data.map((item: any) => {
        return {
          id: item.track.id,
          songName: item.track.name,
          artist: item.track.artists[0].name,
          image640_url: item.track.album.images[0].url,
          preview_url: item.track.preview_url,
          external_urls_spotify: item.track.external_urls.spotify,
        };
      });
      break;
    case "search":
      newTobipoData = data.map((item: any) => {
        return {
          id: item.id,
          songName: item.name,
          artist: item.artists[0].name,
          image640_url: item.album.images[0].url,
          preview_url: item.preview_url,
          external_urls_spotify: item.external_urls.spotify,
        };
      });
      break;
    default:
      break;
  }
  return newTobipoData;
  // dictが入ったArray
}

export default extractTobipoData;