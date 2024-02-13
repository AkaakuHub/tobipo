
const extractTobipoData = (data: any) => {
  const newTobipoData = data.map((item: any) => {
    return {
      id: item.track.id,
      songName: item.track.name,
      artist: item.track.artists[0].name
    };
  });

  // const tobipoIDsArray = newTobipoData.map((item: any) => item.id);
  // const tobipoSongNamesArray = newTobipoData.map((item: any) => item.songName);
  // const tobipoArtistsArray = newTobipoData.map((item: any) => item.artist);

  // return [tobipoIDsArray, tobipoSongNamesArray, tobipoArtistsArray];
  return newTobipoData;
  // dictが入ったArray
}

export default extractTobipoData;