/*************************************************************************
    > Copyright (c) 2023 Netcan
    > File Name: StatusBar.tsx
    > Blog: https://netcan.github.io/
    > Mail: netcan1996@gmail.com
************************************************************************/
import {transferInfo} from "./Torrent";

const StatusBar: React.FC = () => {
    transferInfo().then(console.log);
    return (<> </>);
}

export default StatusBar;
