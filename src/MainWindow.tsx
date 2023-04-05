import TorrentList, {Torrent, fetchTorrents} from './TorrentList';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { DataTableSelection, DataTableFilterMeta } from 'primereact/datatable';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Splitter, SplitterPanel } from 'primereact/splitter';

const MainWindow: React.FC = () => {
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
        fetchTorrents(setTorrents)();
        const id = setInterval(fetchTorrents(setTorrents), 5000);
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
                <SplitterPanel className="flex align-items-center justify-content-center" size={20} minSize={10}>Panel 1</SplitterPanel>
                <SplitterPanel className="flex align-items-center justify-content-center" size={80}>
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
