import _ from 'lodash';

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

export interface TorrentGenericProp {
    save_path: string,                  // Torrent save path
    creation_date: number,              // Torrent creation date (Unix timestamp)
    piece_size: number,                 // Torrent piece size (bytes)
    comment: string,                    // Torrent comment
    total_wasted: number,               // Total data wasted for torrent (bytes)
    total_uploaded: number,             // Total data uploaded for torrent (bytes)
    total_uploaded_session: number,     // Total data uploaded this session (bytes)
    total_downloaded: number,           // Total data downloaded for torrent (bytes)
    total_downloaded_session: number,   // Total data downloaded this session (bytes)
    up_limit: number,                   // Torrent upload limit (bytes/s)
    dl_limit: number,                   // Torrent download limit (bytes/s)
    time_elapsed: number,               // Torrent elapsed time (seconds)
    seeding_time: number,               // Torrent elapsed time while complete (seconds)
    nb_connections: number,             // Torrent connection count
    nb_connections_limit: number,       // Torrent connection count limit
    share_ratio: number,                // Torrent share ratio
    addition_date: number,              // When this torrent was added (unix timestamp)
    completion_date: number,            // Torrent completion date (unix timestamp)
    created_by: string,                 // Torrent creator
    dl_speed_avg: number,               // Torrent average download speed (bytes/second)
    dl_speed: number,                   // Torrent download speed (bytes/second)
    eta: number,                        // Torrent ETA (seconds)
    last_seen: number,                  // Last seen complete date (unix timestamp)
    peers: number,                      // Number of peers connected to
    peers_total: number,                // Number of peers in the swarm
    pieces_have: number,                // Number of pieces owned
    pieces_num: number,                 // Number of pieces of the torrent
    reannounce: number,                 // Number of seconds until the next announce
    seeds: number,                      // Number of seeds connected to
    seeds_total: number,                // Number of seeds in the swarm
    total_size: number,                 // Torrent total size (bytes)
    up_speed_avg: number,               // Torrent average upload speed (bytes/second)
    up_speed: number,                   // Torrent upload speed (bytes/second)
};

export enum PieceState {
    NotDownloaded = 0,
    Downloading = 1,
    Downloaded = 2
};

type ApiName = 'torrents';
type MethodName<T extends ApiName> =
    T extends 'torrents'
        ? 'info' | 'properties' | 'pieceStates'
        : unknown;

async function qbApiFetch<T>(apiName: ApiName, methodName: MethodName<ApiName>, args?: Record<string, any>) {
    try {
        const response = await fetch(`/api/v2/${apiName}/${methodName}?${new URLSearchParams(args)}`);
        if (response.ok) {
            const res: T = await response.json();
            return res;
        } else {
            console.error('Failed to fetch torrents data');
        }
    } catch (error) {
        console.error('Error while fetching torrents data', error);
    }
}

export async function torrentsInfo<S extends (_: Torrent[]) => unknown>(setter: S) {
    const torrents = await qbApiFetch<Torrent[]>('torrents', 'info');
    setter(torrents ?? []);
}

export async function torrentsProperties(hash: string) {
    return await qbApiFetch<TorrentGenericProp>('torrents', 'properties', {hash: hash});
};

function reducePieceStates(states: PieceState[]): PieceState[] {
    const maxPieces = 512;
    if (states.length <= maxPieces) {
        console.log(states.length);
        return states;
    }
    const group = Math.ceil(states.length / maxPieces);
    /*
       NotDownloaded, Downloading = Downloading
       NotDownloaded, Downloaded = NotDownloaded
       Downloading, Downloaded = Downloading
     */
    return _.chunk(states, group).map((g) => {
        if (_.uniq(g).length === 1) {
            return g[0];
        } else {
            const stateCount = _.countBy(g);
            if (stateCount[PieceState.Downloading] > 0) {
                return PieceState.Downloading;
            } else {
                return stateCount[PieceState.Downloaded] > stateCount[PieceState.NotDownloaded] ?
                    PieceState.Downloaded : PieceState.NotDownloaded;
            }
        }
    });
}

export async function torrentsPieceStates(hash: string) {
    return reducePieceStates(await qbApiFetch<PieceState[]>('torrents', 'pieceStates', {hash: hash}) ?? []);
}

export enum StatusGroup {
    DOWNLOAD = "download",
    PAUSE = "pause",
    UPLOAD = "upload",
    CHECK = "check",
    ACTIVE = "active",
    ERROR = "error",
};

type StatusTableType =
    { [key in StatusGroup]: { readonly states: TorrentState[], readonly icon: string } } &
    { readonly is: (ts: TorrentState, sg: StatusGroup) => boolean };

export const StatusTable: StatusTableType = {
    [StatusGroup.DOWNLOAD]: {
       states: ['downloading', 'metaDL', 'stalledDL', 'queuedDL', 'forcedDL'],
       icon: 'pi-arrow-circle-down',
    },
    [StatusGroup.PAUSE]:    {
       states: ['pausedDL', 'pausedUP'],
       icon: 'pi-pause'
    },
    [StatusGroup.UPLOAD]:   {
       states: ['uploading', 'stalledUP', 'queuedUP', 'forcedUP'],
       icon: 'pi-arrow-circle-up',
    },
    [StatusGroup.CHECK]:    {
       states: ['checkingUP', 'checkingDL', 'checkingResumeData'],
       icon: 'pi-sync'
    },
    [StatusGroup.ACTIVE]:   {
       states: ['downloading', 'metaDL', 'uploading'],
       icon: 'pi-arrow-right-arrow-left'
    },
    [StatusGroup.ERROR]:    {
       states: ['error', 'missingFiles'],
       icon: 'pi-exclamation-triangle'
    },
    is: function (ts: TorrentState, sg: StatusGroup): boolean {
        return this[sg].states.includes(ts);
    }
}

