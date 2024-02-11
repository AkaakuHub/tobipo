import React from 'react'
import { accessUrl } from "./login/Spotify";
import { Button } from "@mui/material";

import styled from '@emotion/styled';

const SpotifyButton = styled(Button)`
    background-color: #1fdf64;
    color: white;

    &:hover {
        background-color: #179645;
    }
`;

function Login() {
    return (
        <div className="Login">
            <h2>跳びポを探す</h2>

            <SpotifyButton
                href={accessUrl}
            >
                Spotifyにログインする
            </SpotifyButton>

            <div>使用しているプレイリスト</div>
            <iframe src={"https://open.spotify.com/embed/playlist/1evrJkF0lPEDvUa1RlTKJt"}
                width="90%" height="300" frameBorder="0" allowTransparency={true}
                allow="encrypted-media">
            </iframe>
        </div>
    )
}

export default Login

