
const extractTobipoData = (data: any) => {
  const newTobipoData = data.map((item: any) => {
    return {
      id: item.track.id,
      songName: item.track.name,
      artist: item.track.artists[0].name,
      image640: item.track.album.images[0].url,
    };
  });
  return newTobipoData;
  // dictが入ったArray
}

export default extractTobipoData;