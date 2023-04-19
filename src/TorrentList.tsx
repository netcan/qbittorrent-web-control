import React, { useRef, Dispatch, SetStateAction } from 'react';
import { DataTable, DataTableSelectionChangeEvent,
    DataTableSelection, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import * as Torrent from './Torrent';
import { StatusGroup, StatusTable } from './Torrent';
import { parseSpeed, parseEpoch, parseSize, getHostName } from './Utils';

export function stateIcon(state: Torrent.TorrentState) {
    if (StatusTable.is(state, StatusGroup.DOWNLOAD)) {
        return StatusTable[StatusGroup.DOWNLOAD].icon;
    } else if (StatusTable.is(state, StatusGroup.UPLOAD)) {
        return StatusTable[StatusGroup.UPLOAD].icon;
    } else if (StatusTable.is(state, StatusGroup.PAUSE)) {
        return StatusTable[StatusGroup.PAUSE].icon;
    } else if (StatusTable.is(state, StatusGroup.CHECK)) {
        return StatusTable[StatusGroup.CHECK].icon;
    } else if (StatusTable.is(state, StatusGroup.ERROR)) {
        return StatusTable[StatusGroup.ERROR].icon;
    }
}

const parseField = (field: keyof Torrent.Torrent) => {
    return (torrent: Torrent.Torrent) => {
        switch (field) {
            case 'progress':
                return (<ProgressBar value={torrent[field] * 100}/>);
            case 'size':
            case 'total_size':
            case 'uploaded':
                return parseSize(torrent[field]);
            case 'ratio':
                return torrent[field].toFixed(2);
            case 'num_seeds':
                return `${torrent[field]} (${torrent.num_complete})`;
            case 'num_leechs':
                return `${torrent[field]} (${torrent.num_incomplete})`;
            case 'dlspeed':
            case 'upspeed':
                return parseSpeed(torrent[field]);
            case 'added_on':
            case 'completion_on':
            case 'last_activity':
            case 'seen_complete':
                return parseEpoch(torrent[field]);
            case 'tracker':
                return getHostName(torrent[field]);
            case 'name':
                return (<><span className={`pi ${stateIcon(torrent.state)}`}/> {torrent[field]}</>);
            default:
                return torrent[field];
        }
    };
}

interface TorrentListProps {
    torrents: Torrent.Torrent[],
    selectedTorrents: DataTableSelection<Torrent.Torrent[]>,
    filters: DataTableFilterMeta,
    setSelectedTorrents: Dispatch<SetStateAction<DataTableSelection<Torrent.Torrent[]>>>
};

const TorrentList: React.FC<TorrentListProps> = ({ torrents, filters, selectedTorrents, setSelectedTorrents }) => {
    const columns: { field: keyof Torrent.Torrent, label: string }[] = [
        { field: 'tracker', label: 'Tracker' },
        { field: 'name', label: 'Name' },
        { field: 'total_size', label: 'Total Size' },
        { field: 'progress', label: 'Progress' },
        { field: 'ratio', label: 'Ratio' },
        { field: 'num_seeds', label: 'Seeder' },
        { field: 'num_leechs', label: 'Leecher' },
        { field: 'dlspeed', label: 'Down Speed' },
        { field: 'upspeed', label: 'Up Speed' },
        { field: 'uploaded', label: 'Uploaded' },
        { field: 'size', label: 'Completed Size' },
        { field: 'added_on', label: 'Added On' },
        { field: 'save_path', label: 'Download Path' },
        { field: 'last_activity', label: 'Last Activity' },
        { field: 'completion_on', label: 'Completed On' },
    ];
    const dt = useRef<DataTable<Torrent.Torrent[]>>(null);

    return (
        <DataTable
            className='torrent-list'
            value={torrents} size='small'
            stripedRows paginator
            removableSort
            dataKey="hash"
            ref={dt}
            selectionMode="checkbox"
            resizableColumns
            columnResizeMode="expand"
            reorderableColumns
            filters={filters}
            globalFilterFields={['name', 'save_path', 'tracker']}
            scrollable scrollHeight='flex'
            selection={selectedTorrents}
            onSelectionChange={(e: DataTableSelectionChangeEvent<Torrent.Torrent[]>) => setSelectedTorrents(e.value)}
            dragSelection
            stateStorage='local'
            stateKey="torrent-list-state"
            rows={200} rowsPerPageOptions={[50, 100, 200, 500]}
        >
            <Column selectionMode="multiple"></Column>
            { columns.map((col) => (
                <Column sortable
                    header={col.label}
                    key={col.field} field={col.field}
                    body={parseField(col.field)}
                />
            )) }
        </DataTable>
    );
};

export default TorrentList;
