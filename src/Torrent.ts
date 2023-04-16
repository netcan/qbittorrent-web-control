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

export async function fetchTorrents<T extends (_: Torrent[]) => unknown>(setter: T) {
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
}

export function isDownload(torrent: Torrent) {
    return ['downloading', 'metaDL', 'stalledDL', 'queuedDL', 'forcedDL'].includes(torrent.state);
}

export function isUpload(torrent: Torrent) {
    return ['uploading', 'stalledUP', 'queuedUP', 'forcedUP'].includes(torrent.state);
}

export function isActivate(torrent: Torrent) {
    return ['downloading', 'metaDL', 'uploading'].includes(torrent.state);
}

export function isPaused(torrent: Torrent) {
    return ['pausedDL', 'pausedUP'].includes(torrent.state);
}

export function isChecking(torrent: Torrent) {
    return ['checkingUP', 'checkingDL', 'checkingResumeData'].includes(torrent.state);
}

export function isError(torrent: Torrent) {
    return ['error', 'missingFiles'].includes(torrent.state);
}

export const downloadIcon = 'pi-arrow-circle-down';
export const uploadIcon = 'pi-arrow-circle-up';
export const activeIcon = 'pi-arrow-right-arrow-left';
export const pausedIcon = 'pi-pause';
export const checkingIcon = 'pi-sync';
export const errorIcon = 'pi-exclamation-triangle';

