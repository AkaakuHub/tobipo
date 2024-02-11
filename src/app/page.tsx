"use client";

import React, { useState, useEffect } from 'react';
import Login from "./loginPage"
import LoggedIn from "./loggedinPage"
import { getTokenFromUrl } from './login/Spotify';
import Cookies from 'js-cookie';

import { CircularProgress } from '@mui/material';

function App() {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const token: string = hash.access_token as string;

    if (token) {// auth後
      Cookies.set('temp_token', token, { secure: true });
      setToken(token)
    } else {
      const token = Cookies.get('temp_token');
      if (token) {
        Cookies.set('temp_token', token, { secure: true });
        setToken(token)
      }
    }
    setLoading(false);
  }, [])

  return (
    <div className="App">
      {loading ? (
        <div className='loading'>
          <CircularProgress size={100} />
        </div>
      ) :
        token ? <LoggedIn token={token}
        /> : <Login />}
    </div>
  );
}

export default App;