import React from 'react'
import { accessUrl } from "./login/Spotify";

import SpotifyColorButton from "./components/SpotifyColorButton";

function Login() {
    return (
        <div className="Login">
            <h2>跳びポを探す</h2>

            <SpotifyColorButton
                href={accessUrl}
            >
                Spotifyにログインする
            </SpotifyColorButton>

            <div>使用しているプレイリスト</div>
            <iframe src={"https://open.spotify.com/embed/playlist/1evrJkF0lPEDvUa1RlTKJt"}
                width="90%" height="480" frameBorder="0"
                allow="encrypted-media">
            </iframe>
        </div>
    )
}

export default Login

