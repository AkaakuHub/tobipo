import Cookies from 'js-cookie';

const judgeStatus = (status: number) => {
  if (status === 401) {
    console.log('Unauthorized token');
    sessionStorage.removeItem('temp_token');
    Cookies.set('error_message', '無効なトークンです。もう一度ログインしてください。', { secure: true })
    window.location.href = '/';
    return false;
  } else if (status === 500) {
    console.log('Internal server error');
    sessionStorage.removeItem('temp_token');
    Cookies.set('error_message', 'サーバーエラーです。もう一度ログインしてください。', { secure: true })
    window.location.href = '/';
    return false;
  } else {
    return true;
  }
}

const fetch_doClientCredentials = async () => {
  const res = await fetch("api/doClientCredentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return res;
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

const fetch_searchMusic = async (songName: string, token: string, maxMusicCount: number) => {
  const res = await fetch("api/searchMusic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ search: songName, token: token, maxMusicCount: maxMusicCount })
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

const fetch_metadata = async (id: string) => {
  // これだけ、サーバーサイドで呼ばれるので、URLを気をつける
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${baseUrl}/api/getMetaData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id })
  });
  return res;
}

export { fetch_doClientCredentials, judgeStatus, fetch_getTobipoPlaylist, fetch_searchMusic, fetch_getRandomTobipoMusic, fetch_metadata };