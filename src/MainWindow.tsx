/*************************************************************************
    > Copyright (c) 2023 Netcan
    > File Name: MainWindow.tsx
    > Blog: https://netcan.github.io/
    > Mail: netcan1996@gmail.com
************************************************************************/

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
import _ from 'lodash';

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
        torrentsInfo().then(setTorrents);
        const id = setInterval(() => torrentsInfo().then(setTorrents), 3000);
        return _.partial(clearInterval, id);
    }, []);

    const searchInput = (
        <InputText placeholder="Search"
            onChange={searchWordOnChange}
            type="text" className="w-full" />
    );

    return (
        <div className='h-screen flex flex-column'>
            <Menubar end={searchInput}/>
            <Splitter className='h-full overflow-auto'>
                <SplitterPanel
                    className='overflow-auto'
                    size={20}>
                    <SideBar
                        torrents={torrents}
                        setFilters={setFilters}
                    />
                </SplitterPanel>

                <SplitterPanel
                    className='overflow-auto'
                    size={80}>
                    <Splitter layout='vertical' className='w-full'>
                        <SplitterPanel className='overflow-auto' size={70}>
                            <TorrentList
                                torrents={torrents}
                                filters={filters}
                                selectedTorrents={selectedTorrents}
                                setSelectedTorrents={setSelectedTorrents}
                                setDetailTorrent={setDetailTorrent}
                            />
                        </SplitterPanel>
                        <SplitterPanel size={30} className='overflow-auto'>
                            <TorrentPanel detailTorrent={detailTorrent} torrents={torrents}/>
                        </SplitterPanel>
                    </Splitter>
                </SplitterPanel>
            </Splitter>
        </div>
    );
};

export default MainWindow;
