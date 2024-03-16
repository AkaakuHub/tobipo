"use client";

import React, { useState, useEffect } from 'react';
import Login from "@/components/(pages)/loginPage";
import LoggedIn from "@/components/(pages)/loggedinPage"

import { getTokenFromUrl } from './login/Spotify';

function App() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = getTokenFromUrl();
    setTimeout(() => {
      window.location.hash = "";
    }, 0);
    const token: string = hash.access_token as string;

    if (token) {
      // auth後
      sessionStorage.setItem('temp_token', token);
      setToken(token);
    } else {
      const token = sessionStorage.getItem('temp_token');
      if (token) {
        setToken(token);
      }
    }
    setLoading(false);
  }, [])

  return (
    <>
      {
        loading ? (<div></div >) :
          (
            token ? (
              <>
                <LoggedIn token={token} />
              </>
            ) : (
              <>
                <Login />
              </>
            )
          )
      }
    </>
  );
}

export default App;