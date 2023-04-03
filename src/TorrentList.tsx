import React, { useRef, Dispatch, SetStateAction } from 'react';
import { DataTable, DataTableSelectionChangeEvent,
    DataTableSelection, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';

export type TorrentState =
    | "error"              // Some error occurred, applies to paused torrents
    | "missingFiles"       // Torrent data files is missing
    | "uploading"          // Torrent is being seeded and data is being transferred
    | "pausedUP"           // Torrent is paused and has finished downloading
    | "queuedUP"           // Queuing is enabled and torrent is queued for upload
    | "stalledUP"          // Torrent is being seeded, but no connection were made
    | "checkingUP"         // Torrent has finished downloading and is being checked
    | "forcedUP"           // Torrent is forced to uploading and ignore queue limit
    | "allocating"         // Torrent is allocating disk space for download
    | "downloading"        // Torrent is being downloaded and data is being transferred
    | "metaDL"             // Torrent has just started downloading and is fetching metadata
    | "pausedDL"           // Torrent is paused and has NOT finished downloading
    | "queuedDL"           // Queuing is enabled and torrent is queued for download
    | "stalledDL"          // Torrent is being downloaded, but no connection were made
    | "checkingDL"         // Same as checkingUP, but torrent has NOT finished downloading
    | "forcedDL"           // Torrent is forced to downloading to ignore queue limit
    | "checkingResumeData" // Checking resume data on qBt startup
    | "moving"             // Torrent is moving to another location
    | "unknown";           // Unknown status

export interface Torrent {
    added_on: number,                    // Time (Unix Epoch) when the torrent was added to the client
    amount_left: number,                 // Amount of data left to download (bytes)
    auto_tmm: boolean,                   // Whether this torrent is managed by Automatic Torrent Management
    availability: number,                // Percentage of file pieces currently available
    category: string,                    // Category of the torrent
    completed: number,                   // Amount of transfer data completed (bytes)
    completion_on: number,               // Time (Unix Epoch) when the torrent completed
    content_path: string,                // Absolute path of torrent content (root path for multifile torrents, absolute file path for singlefile torrents)
    dl_limit: number,                    // Torrent download speed limit (bytes/s). -1 if ulimited.
    dlspeed: number,                     // Torrent download speed (bytes/s)
    downloaded: number,                  // Amount of data downloaded
    downloaded_session: number,          // Amount of data downloaded this session
    eta: number,                         // Torrent ETA (seconds)
    f_l_piece_prio: boolean,             // True if first last piece are prioritized
    force_start: boolean,                // True if force start is enabled for this torrent
    hash: string,                        // Torrent hash
    last_activity: number,               // Last time (Unix Epoch) when a chunk was downloaded/uploaded
    magnet_uri: string,                  // Magnet URI corresponding to this torrent
    max_ratio: number,                   // Maximum share ratio until torrent is stopped from seeding/uploading
    max_seeding_time: number,            // Maximum seeding time (seconds) until torrent is stopped from seeding
    name: string,                        // Torrent name
    num_complete: number,                // Number of seeds in the swarm
    num_incomplete: number,              // Number of leechers in the swarm
    num_leechs: number,                  // Number of leechers connected to
    num_seeds: number,                   // Number of seeds connected to
    priority: number,                    // Torrent priority. Returns -1 if queuing is disabled or torrent is in seed mode
    progress: number,                    // Torrent progress (percentage/100)
    ratio: number,                       // Torrent share ratio. Max ratio value: 9999.
    ratio_limit: number,                 // TODO (what is different from max_ratio?)
    save_path: string,                   // Path where this torrent's data is stored
    seeding_time: number,                // Torrent elapsed time while complete (seconds)
    seeding_time_limit: number,          // TODO (what is different from max_seeding_time?) seeding_time_limit is a per torrent setting, when Automatic Torrent Management is disabled, furthermore then max_seeding_time is set to seeding_time_limit for this torrent. If Automatic Torrent Management is enabled, the value is -2. And if max_seeding_time is unset it have a default value -1.
    seen_complete: number,               // Time (Unix Epoch) when this torrent was last seen complete
    seq_dl: boolean,                     // True if sequential download is enabled
    size: number,                        // Total size (bytes) of files selected for download
    state: TorrentState,                 // Torrent state.
    super_seeding: boolean,              // True if super seeding is enabled
    tags: string,                        // Comma-concatenated tag list of the torrent
    time_active: number,                 // Total active time (seconds)
    total_size: number,                  // Total size (bytes) of all file in this torrent (including unselected ones)
    tracker: string,                     // The first tracker with working status. Returns empty string if no tracker is working.
    up_limit: number,                    // Torrent upload speed limit (bytes/s). -1 if ulimited.
    uploaded: number,                    // Amount of data uploaded
    uploaded_session: number,            // Amount of data uploaded this session
    upspeed: number,                     // Torrent upload speed (bytes/s)
};

const parseSize = (size: number) => {
    const sizeUnit = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
    let sizeUnitIdx = 0;
    while (size > 1024) {
        sizeUnitIdx++;
        size /= 1024;
    }

    return `${size.toFixed(2)} ${sizeUnit[sizeUnitIdx]}`;
}

const parseSpeed = (size: number) => {
    return `${parseSize(size)}/s`;
}

const parseEpoch = (epoch: number) => {
    return new Date(epoch * 1000).toLocaleString('zh');
}

const parseState = (state: TorrentState) => {
    switch (state) {
        case 'uploading':
        case 'stalledUP':
            return (<span className='pi pi-arrow-circle-up'/>);
        case 'downloading':
        case 'stalledDL':
            return (<span className='pi pi-arrow-circle-down'/>);
        case 'pausedUP':
        case 'pausedDL':
            return (<span className='pi pi-pause'/>);
        case 'checkingUP':
        case 'checkingDL':
        case 'checkingResumeData':
            return (<span className='pi pi-sync'/>);
        case 'error':
        case 'missingFiles':
            return (<span className='pi pi-exclamation-triangle'/>);
    }
};

const parseField = (field: keyof Torrent) => {
    return (torrent: Torrent) => {
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
            case 'name':
                return (<>{parseState(torrent.state)} {torrent[field]}</>);
            default:
                return torrent[field];
        }
    };
}

export const fetchTorrents = (setter: Dispatch<SetStateAction<Torrent[]>>) => {
    return async () => {
        try {
            const response = await fetch('/api/v2/torrents/info');
            if (response.ok) {
                const torrentsData: Torrent[] = await response.json();
                setter(torrentsData);
            } else {
                console.error('Failed to fetch torrents data');
            }
        } catch (error) {
            console.error('Error while fetching torrents data', error);
        }
    };
}

interface TorrentListProps {
    torrents: Torrent[],
    selectedTorrents: DataTableSelection<Torrent[]>,
    filters: DataTableFilterMeta,
    setSelectedTorrents: Dispatch<SetStateAction<DataTableSelection<Torrent[]>>>
};

const TorrentList: React.FC<TorrentListProps> = ({ torrents, filters, selectedTorrents, setSelectedTorrents }) => {
    const columns: { field: keyof Torrent, label: string }[] = [
        { field: 'name', label: 'Name' },
        { field: 'total_size', label: 'Size' },
        { field: 'progress', label: 'Progress' },
        { field: 'ratio', label: 'Ratio' },
        { field: 'num_seeds', label: 'Seeder' },
        { field: 'num_leechs', label: 'Leecher' },
        { field: 'dlspeed', label: 'Down Speed' },
        { field: 'upspeed', label: 'Up Speed' },
        { field: 'uploaded', label: 'Uploaded' },
        { field: 'added_on', label: 'Added On' },
        { field: 'save_path', label: 'Download Path' },
        { field: 'last_activity', label: 'Last Activity' },
        { field: 'completion_on', label: 'Completed On' },
    ];
    const dt = useRef<DataTable<Torrent[]>>(null);

    return (
        <DataTable
            value={torrents} size='small'
            stripedRows paginator
            removableSort
            dataKey="hash"
            ref={dt}
            selectionMode="checkbox"
            resizableColumns
            /* columnResizeMode="expand" */
            reorderableColumns
            filters={filters}
            globalFilterFields={['name', 'save_path']}
            scrollable scrollHeight='flex'
            selection={selectedTorrents}
            onSelectionChange={(e: DataTableSelectionChangeEvent<Torrent[]>) => setSelectedTorrents(e.value)}
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
