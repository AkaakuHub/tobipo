import Cookies from 'js-cookie';


const judgeStatus = (status: number) => {
  if (status === 401) {
    console.log('Unauthorized token');
    Cookies.remove('temp_token');
    Cookies.set('error_message', '無効なトークンです', { secure: true })
    window.location.href = '/';
    return false;
  } else if (status === 500) {
    console.log('Internal server error');
    Cookies.remove('temp_token');
    Cookies.set('error_message', 'サーバーエラーです', { secure: true })
    window.location.href = '/';
    return false;
  } else {
    return true;
  }
}

const fetch_getTobipoPlaylist = async (token: string) => {
  const res = await fetch("api/getTobipoPlaylist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token: token })
  });
  return res;
}

const fetch_searchMusic = async (songName: string, token: string) => {
  const res = await fetch("api/searchMusic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ search: songName, token: token })
  });
  return res;
}

const fetch_getRandomTobipoMusic = async (numOfTracks: number) => {
  const res = await fetch("api/getRandomTobipoMusic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ numOfTracks: numOfTracks })
  });
  return res;
}

export { judgeStatus, fetch_getTobipoPlaylist, fetch_searchMusic, fetch_getRandomTobipoMusic };