"use client";

import React, { useState, useEffect } from 'react';
import Login from "./loginPage"
import LoggedIn from "./loggedinPage"
import Shared from "./sharedPage"
import { getTokenFromUrl } from './login/Spotify';
// import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import { Share } from 'next/font/google';

function App() {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams()
  const id = searchParams.get("id");
  // console.log(id);
  // ない場合はnull

  useEffect(() => {
    const hash = getTokenFromUrl();
    setTimeout(() => {
      window.location.hash = "";
    }, 0);
    const token: string = hash.access_token as string;

    if (token) {
      // auth後
      // Cookies.set('temp_token', token, { secure: true });
      setToken(token)
    } else {
      // const token = Cookies.get('temp_token');
      // if (token) {
      //   // Cookies.set('temp_token', token, { secure: true });
      //   setToken(token)
      // }
    }
    setLoading(false);
  }, [])

  return (
    <>
      {id !== null ?
        <Shared id={id} /> :
        (
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
        )
      }
    </>
  );
}

export default App;