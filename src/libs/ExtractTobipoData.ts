import { TobipoData } from "@/app/types";

const extractTobipoData = (data: any, kind: string) => {
  let newTobipoData: { [key: string]: TobipoData } = {};
  newTobipoData = data.reduce((acc: { [key: string]: TobipoData }, item: any) => {
    if (kind === "playlist") {
      item = item.track;
    }
    acc[item.id] = {
      songName: item.name,
      artist: item.artists[0].name,
      image640_url: item.album.images[0]?.url || "",
      preview_url: item?.preview_url || null,
      external_urls_spotify: item?.external_urls.spotify || "",
    };
    return acc;
  }, {});
  return newTobipoData;
};

export default extractTobipoData;