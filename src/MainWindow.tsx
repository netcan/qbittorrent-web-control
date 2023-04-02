import TorrentList, {Torrent, fetchTorrents} from './TorrentList';
import React, { useState, useEffect } from 'react';
import { DataTableSelection } from 'primereact/datatable';

const MainWindow: React.FC = () => {
    const [torrents, setTorrents] = useState<Torrent[]>([]);
    const [selectedTorrents, setSelectedTorrents] = useState([] as DataTableSelection<Torrent[]>);
    useEffect(() => {
        fetchTorrents(setTorrents)();
        const id = setInterval(fetchTorrents(setTorrents), 5000);
        return () => { clearInterval(id) };
    }, []);


    return <TorrentList
        torrents={torrents}
        selectedTorrents={selectedTorrents}
        setSelectedTorrents={setSelectedTorrents}
    />;
};

export default MainWindow;
