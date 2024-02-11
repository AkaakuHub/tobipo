import React from 'react'
import { Button } from "@mui/material";
import { Input } from '@mui/material';
import { useState } from 'react';

import searchMusic from './searchMusic';

function LoggedIn(props: { token: string }) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    return (
        <>
            <div>
                <h2>検索ページ</h2>
            </div>
            <div>
                <Input placeholder="曲名を入力" onChange={e => setSearch(e.target.value)} />
                <Button variant="contained" color="primary"
                    onClick={async () => {
                        const res = await searchMusic(search, props.token);
                        console.log(res)
                        setResults(res)
                    }
                    }>検索</Button>
            </div>
            <div>
                {results ?
                    <pre>{JSON.stringify(results, null, 2)}</pre> :
                    "検索結果はありません"}
            </div>
        </>

    )
}

export default LoggedIn