import React from 'react'
import { accessUrl } from "./Spotify";
import { Button } from "@mui/material";

function Login() {
    return (
        <div className="Login">
            <h2>跳びポを探す</h2>
            
            <Button
                variant="contained"
                color="primary"
                href={accessUrl}
            >
                Spotifyでログイン
            </Button>
        </div>
    )
}

export default Login

