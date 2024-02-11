"use client";

import React, { useState, useEffect } from 'react';
import Login from "./login/page"
import LoggedIn from "./dashboard/page"
import { getTokenFromUrl } from './login/Spotify';


function App() {
  const [token, setToken] = useState("")

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const token: string = hash.access_token as string;

    if (token) {
      setToken(token)
    }

  }, [])

  return (
    <div className="App">
      {token ? <LoggedIn token={token}
      /> : <Login />}
    </div>
  );
}

export default App;