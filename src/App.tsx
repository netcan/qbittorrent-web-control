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
