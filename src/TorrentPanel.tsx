/*************************************************************************
    > Copyright (c) 2023 Netcan
    > File Name: TorrentPanel.tsx
    > Blog: https://netcan.github.io/
    > Mail: netcan1996@gmail.com
************************************************************************/

import { parseETA, torrentPeers, PieceState, Torrent, TorrentGenericProp, torrentsPieceStates, torrentsProperties, torrentsTrackers, Tracker, TrackerState, Peer } from './Torrent';
import { TabView, TabPanel } from 'primereact/tabview';
import {parseDuration, parseEpoch, parseSize, parseSpeed} from './Utils';
import {useEffect, useState} from 'react';
import { Divider } from 'primereact/divider';
import TorrentTable from './TorrentTable';
import { ProgressBar } from 'primereact/progressbar';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import _ from 'lodash';

interface TorrentPanelProp {
    detailTorrent: Torrent | null
    torrents: Torrent[]
}

const TorrentPieces: React.FC<TorrentPanelProp> = ({detailTorrent, torrents}) => {
    const [torrentPieces, setTorrentPieces] = useState<PieceState[]>([]);
    useEffect(() => {
        detailTorrent && torrentsPieceStates(detailTorrent.hash)
                            .then(setTorrentPieces);
    }, [detailTorrent, torrents]);

    const maxPieces = 512;
    const group = Math.ceil(torrentPieces.length / maxPieces);

    return (
        <div className='torrent-pieces'>
            {
                _.chunk(torrentPieces, group).map((g) => {
                    const stateCount = _.countBy(g);
                    if (stateCount[PieceState.Downloading] > 0) {
                        return { className: `bg-orange-400`, };
                    } else {
                        return {
                            className: `bg-green-400`,
                            style: {
                                filter: `saturate(${(stateCount[PieceState.Downloaded] ?? 0) / g.length})`
                            }
                        };
                    }
                }).map((prop, index) => {
                    return (<i key={index} {...prop}/>)
                })
            }
        </div>
    );
}

const DetailTorrent: React.FC<TorrentPanelProp> = ({detailTorrent, torrents}) => {
    const [torrentProp, setTorrentProp] = useState<TorrentGenericProp>();
    useEffect(() => {
        detailTorrent && torrentsProperties(detailTorrent.hash)
                            .then(setTorrentProp);
    }, [detailTorrent, torrents]);

    return (
        <table className='w-full'>
            <tbody>
                <tr>
                    <td className='torrent-field'>Name:</td><td className='torrent-value' colSpan={3}>{detailTorrent?.name}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Save Path:</td><td className='torrent-value' colSpan={3}>{detailTorrent?.save_path}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Hash:</td><td className='torrent-value'>{detailTorrent?.hash}</td>
                    <td className='torrent-field'>Reannounce In:</td><td className='torrent-value'>{torrentProp && parseDuration(torrentProp.reannounce)}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Time Active:</td><td className='torrent-value'>{torrentProp && `${parseDuration(torrentProp.time_elapsed, 2)} (seeded for ${parseDuration(torrentProp?.seeding_time, 2)})`} </td>
                    <td className='torrent-field'>ETA:</td><td className='torrent-value'>{torrentProp && parseETA(torrentProp.eta)}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Added On:</td><td className='torrent-value'>{detailTorrent && parseEpoch(detailTorrent.added_on)}</td>
                    <td className='torrent-field'>Last Activity:</td><td className='torrent-value'>{detailTorrent && parseEpoch(detailTorrent.last_activity)}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Downloaded:</td><td className='torrent-value'>{detailTorrent && `${parseSize(detailTorrent.downloaded)} / ${parseSize(detailTorrent.size)}`}</td>
                    <td className='torrent-field'>Total Size:</td><td className='torrent-value'>{detailTorrent && parseSize(detailTorrent.total_size)}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Uploaded:</td><td className='torrent-value'>{detailTorrent && parseSize(detailTorrent.uploaded)}</td>
                    <td className='torrent-field'>Share Ratio:</td><td className='torrent-value'>{torrentProp?.share_ratio.toFixed(2)}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Upload Speed:</td><td className='torrent-value'>{torrentProp && `${parseSpeed(torrentProp.up_speed)} (${parseSpeed(torrentProp.up_speed_avg)} avg.)`}</td>
                    <td className='torrent-field'>Download Speed:</td><td className='torrent-value'>{torrentProp && `${parseSpeed(torrentProp.dl_speed)} (${parseSpeed(torrentProp.dl_speed_avg)} avg.)`}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Seeds</td><td className='torrent-value'>{torrentProp && `${torrentProp.seeds} (${torrentProp.seeds_total} total)`}</td>
                    <td className='torrent-field'>Peers</td><td className='torrent-value'>{torrentProp && `${torrentProp.peers} (${torrentProp.peers_total} total)`}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Create On:</td><td className='torrent-value'>{torrentProp && parseEpoch(torrentProp.creation_date)}</td>
                    <td className='torrent-field'>Create By:</td><td className='torrent-value'>{torrentProp?.created_by}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Pieces:</td><td className='torrent-value'>{ torrentProp && `${torrentProp.pieces_num} x ${parseSize(torrentProp.piece_size)} (have ${torrentProp.pieces_have})` }</td>
                    <td className='torrent-field'>Status:</td><td className='torrent-value'>{detailTorrent?.state}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Comment:</td><td className='torrent-value' colSpan={3}>{torrentProp?.comment}</td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <Divider type='dotted'/>
                        <TorrentPieces torrents={torrents} detailTorrent={detailTorrent}/>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

const TorrentTrackers: React.FC<TorrentPanelProp> = ({detailTorrent, torrents}) => {
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    useEffect(() => {
        detailTorrent && torrentsTrackers(detailTorrent.hash)
                            .then(setTrackers);
    }, [detailTorrent, torrents]);

    const columns: { field: keyof Tracker, label: string }[] = [
        { field: 'url',            label: 'URL' },
        { field: 'status',         label: 'Status' },
        { field: 'num_peers',      label: 'Peers' },
        { field: 'num_seeds',      label: 'Seeds' },
        { field: 'num_leeches',    label: 'Leeches' },
        { field: 'num_downloaded', label: 'Times Downloaded' },
        { field: 'msg',            label: 'Message' },
    ];

    const parseField = (field: keyof Tracker, tracker: Tracker) => {
        switch (field) {
            case 'num_peers':
            case 'num_seeds':
            case 'num_leeches':
            case 'num_downloaded':
                return tracker[field] >= 0 ? tracker[field] : 'N/A';
            case 'status':
                return TrackerState[tracker[field]];
            default:
                return tracker[field];
        }
    };

    return (
        <TorrentTable
            value={trackers}
            dataKey="url"
            stateKey="trackers-state"
            columns={columns}
            parseColumn={parseField}
        />
    );
}

const TorrentPeers: React.FC<TorrentPanelProp> = ({detailTorrent, torrents}) => {
    type PeerWithKey = Peer & { dataKey: string };
    const [peers, setPeers] = useState<PeerWithKey[]>([]);
    useEffect(() => {
        if (!detailTorrent) { return; }
        torrentPeers(detailTorrent.hash).then((peersInfo) => {
            if (!peersInfo || !peersInfo.full_update) { return; }
            setPeers(
                _.reduce(peersInfo.peers, (acc, peer, key) => {
                    acc.push({dataKey: key, ...peer});
                    return acc;
                }, [] as PeerWithKey[])
            );
        });
    }, [detailTorrent, torrents]);

    const columns: { field: keyof Peer, label: string }[] = [
        { field: 'ip',           label: 'IP' },
        { field: 'port',         label: 'Port' },
        { field: 'connection',   label: 'Connection' },
        { field: 'flags',        label: 'Flags' },
        { field: 'client',       label: 'Client' },
        { field: 'progress',     label: 'Progress' },
        { field: 'dl_speed',     label: 'Down Speed' },
        { field: 'up_speed',     label: 'Up Speed' },
        { field: 'downloaded',   label: 'Downloaded' },
        { field: 'uploaded',     label: 'Uploaded' },
        { field: 'relevance',    label: 'Relevance' },
        { field: 'files',        label: 'Files' },
    ];

    const parseField = (field: keyof Peer, peer: Peer) => {
        switch (field) {
            case 'progress':
                return (<ProgressBar value={(peer[field] * 100).toFixed(2)}/>);
            case 'relevance':
                return `${(peer[field] * 100).toFixed(2)} %`;
            case 'dl_speed':
            case 'up_speed':
                return parseSpeed(peer[field]);
            case 'downloaded':
            case 'uploaded':
                return parseSize(peer[field]);
            case 'ip':
                return (
                    <>
                        <span className='text-xl'> { getUnicodeFlagIcon(peer.country_code ?? '') } </span>
                        { peer[field] }
                    </>
                );
            default:
                return peer[field];
        }
    }

    return (
        <TorrentTable
            value={peers}
            dataKey="dataKey"
            stateKey="peers-state"
            columns={columns}
            parseColumn={parseField}
        />
    );
}

const TorrentPanel: React.FC<TorrentPanelProp> = (props) => {
    return (
        <TabView className='h-full flex flex-column torrent-tab-panel'>
            <TabPanel header="General">
                <DetailTorrent {...props}/>
            </TabPanel>
            <TabPanel header="Trackers" className='h-full'>
                <TorrentTrackers {...props}/>
            </TabPanel>
            <TabPanel header="Peers" className='h-full'>
                <TorrentPeers {...props}/>
            </TabPanel>
        </TabView>
    );
}

export default TorrentPanel;
