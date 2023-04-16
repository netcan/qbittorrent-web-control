import TorrentList from './TorrentList';
import { Torrent, fetchTorrents } from './Torrent';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { DataTableSelection, DataTableFilterMeta } from 'primereact/datatable';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import SideBar from './SideBar';

const MainWindow: React.FC = () => {
    const infoWidgetHeight = '90vh';
    const [torrents, setTorrents] = useState<Torrent[]>([]);
    const [selectedTorrents, setSelectedTorrents] = useState([] as DataTableSelection<Torrent[]>);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: '', matchMode: FilterMatchMode.CONTAINS },
    });
    const searchWordOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        let _filters = {...filters};
        if ('value' in _filters['global']) {
            _filters['global'].value = e.target.value;
        }
        setFilters(_filters);
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
                    style={{ overflowX: 'hidden', overflowY: 'auto', height: infoWidgetHeight }}
                    size={20} minSize={10}>
                    <SideBar torrents={torrents}/>
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
