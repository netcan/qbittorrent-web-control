import TorrentList from './TorrentList';
import { Torrent, fetchTorrents } from './Torrent';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { DataTableSelection, DataTableFilterMeta } from 'primereact/datatable';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import SideBar from './SideBar';
import {createFilter} from './Utils';

const MainWindow: React.FC = () => {
    const [torrents, setTorrents] = useState<Torrent[]>([]);
    const [detailTorrent, setDetailTorrent] = useState<Torrent | null>(null);
    const [selectedTorrents, setSelectedTorrents] = useState([] as DataTableSelection<Torrent[]>);
    const [filters, setFilters] = useState<DataTableFilterMeta>({ });
    const searchWordOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => {
            return {...prev, global: createFilter(e.target.value)};
        });
    };

    useEffect(() => {
        fetchTorrents(setTorrents);
        const id = setInterval(fetchTorrents.bind(null, setTorrents), 5000);
        return () => { clearInterval(id) };
    }, []);

    const searchInput = (
        <InputText placeholder="Search"
            onChange={searchWordOnChange}
            type="text" className="w-full" />
    );

    return (
        <div style={{height: '100vh'}}>
            <Menubar end={searchInput}/>
            <Splitter style={{height: '100%'}}>
                <SplitterPanel
                    style={{ overflow: 'auto' }}
                    size={20}>
                    <SideBar
                        torrents={torrents}
                        setFilters={setFilters}
                    />
                </SplitterPanel>

                <SplitterPanel
                    style={{ overflow: 'auto' }}
                    size={80}>
                    <Splitter layout='vertical' style={{maxWidth: '100%'}}>
                        <SplitterPanel className='torrent-list-panel' size={80}>
                            <TorrentList
                                torrents={torrents}
                                filters={filters}
                                selectedTorrents={selectedTorrents}
                                setSelectedTorrents={setSelectedTorrents}
                                setDetailTorrent={setDetailTorrent}
                            />
                        </SplitterPanel>
                        <SplitterPanel size={20}>
                            torrent info panel
                        </SplitterPanel>
                    </Splitter>
                </SplitterPanel>
            </Splitter>
        </div>
    );
};

export default MainWindow;
