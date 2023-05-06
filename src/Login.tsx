/*************************************************************************
    > Copyright (c) 2023 Netcan
    > File Name: Login.tsx
    > Blog: https://netcan.github.io/
    > Mail: netcan1996@gmail.com
************************************************************************/

import React, { useState,  Dispatch, SetStateAction  } from 'react';
import { Dialog } from 'primereact/dialog';

interface LoginProps {
    needLogin: boolean
    setNeedLogin: Dispatch<SetStateAction<boolean>>
};

const Login: React.FC<LoginProps> = ({ needLogin, setNeedLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const res = await fetch('/api/v2/auth/login', {
            method: "POST",
            body: new URLSearchParams({
                username,
                password,
            }),
        });
        const text = await res.text();
        if (text === 'Ok.') {
            setNeedLogin(false);
        }
    };

    return (
        <Dialog header="Header" visible={needLogin} onHide={() => {}}>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">username：</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">password：</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </Dialog>
    );
};

export default Login;
