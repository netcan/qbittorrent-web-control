import Cookie from 'js-cookie';
import TorrentList from './TorrentList';
import {Navigate} from 'react-router-dom';

const Greeting: React.FC = () => {
    const isLogin = Boolean(Cookie.get('isLogin'));
    console.log(`isLogin: ${isLogin}`);
    if (!isLogin) {
        return <Navigate to='/login'/>;
    }

    return <TorrentList/>;
};

export default Greeting;
