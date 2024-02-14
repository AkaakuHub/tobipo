export const authEndpoint = "https://accounts.spotify.com/authorize";

const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

// 対応する範囲を決める
const scopes = [
    // "user-read-currently-playing",
    // "user-read-recently-played",
    // "user-read-playback-state",
    // "user-top-read",
    // "user-modify-playback-state",
    ""
];

export const getTokenFromUrl = () => {
    return window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial: { [key: string]: any }, item) => {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
            return initial
        }, {});
}


// SpotifyのログインページのURL
export const accessUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
