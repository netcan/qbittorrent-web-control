/*************************************************************************
    > Copyright (c) 2023 Netcan
    > File Name: App.tsx
    > Blog: https://netcan.github.io/
    > Mail: netcan1996@gmail.com
************************************************************************/

import Login from './Login';
import MainWindow from './MainWindow';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainWindow/>} />
                    <Route path="/login" element={<Login/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
