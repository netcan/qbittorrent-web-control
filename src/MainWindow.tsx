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
    const infoWidgetHeight = '90vh';
    const [torrents, setTorrents] = useState<Torrent[]>([]);
    const [selectedTorrents, setSelectedTorrents] = useState([] as DataTableSelection<Torrent[]>);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: createFilter(),
        tracker: createFilter(),
        state: createFilter(),
        save_path: createFilter(),
    });
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
        <div className="grid">
            <Menubar className='col-12' end={searchInput}/>
            <Splitter className='col-12'>
                <SplitterPanel
                    style={{ overflow: 'auto', height: infoWidgetHeight }}
                    size={20}>
                    <SideBar
                        torrents={torrents}
                        setFilters={setFilters}
                    />
                </SplitterPanel>

                <SplitterPanel
                    style={{ overflow: 'auto', height: infoWidgetHeight }}
                    size={80}>
                    <TorrentList
                        torrents={torrents}
                        filters={filters}
                        selectedTorrents={selectedTorrents}
                        setSelectedTorrents={setSelectedTorrents}/>
                </SplitterPanel>
            </Splitter>
        </div>
    );
};

export default MainWindow;
