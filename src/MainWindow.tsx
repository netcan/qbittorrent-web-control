import TorrentList from './TorrentList';
import { Torrent, torrentsInfo } from './Torrent';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { DataTableSelection, DataTableFilterMeta } from 'primereact/datatable';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import SideBar from './SideBar';
import {createFilter} from './Utils';
import TorrentPanel from './TorrentPanel';

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
        torrentsInfo(setTorrents);
        const id = setInterval(torrentsInfo.bind(null, setTorrents), 3000);
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
                        <SplitterPanel className='torrent-list-panel' size={70}>
                            <TorrentList
                                torrents={torrents}
                                filters={filters}
                                selectedTorrents={selectedTorrents}
                                setSelectedTorrents={setSelectedTorrents}
                                setDetailTorrent={setDetailTorrent}
                            />
                        </SplitterPanel>
                        <SplitterPanel size={30}>
                            <TorrentPanel detailTorrent={detailTorrent} torrents={torrents}/>
                        </SplitterPanel>
                    </Splitter>
                </SplitterPanel>
            </Splitter>
        </div>
    );
};

export default MainWindow;
