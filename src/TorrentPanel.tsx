/*************************************************************************
    > Copyright (c) 2023 Netcan
    > File Name: TorrentPanel.tsx
    > Blog: https://netcan.github.io/
    > Mail: netcan1996@gmail.com
************************************************************************/

import { parseETA, torrentPeers, PieceState, Torrent, TorrentGenericProp, torrentsPieceStates, torrentsProperties, torrentsTrackers, Tracker, TrackerState, Peer, File, FilePriority, torrentFiles, setFilePrio } from './Torrent';
import { TabView, TabPanel } from 'primereact/tabview';
import {parseDuration, parseEpoch, parseSize, parseSpeed} from './Utils';
import {useEffect, useState} from 'react';
import { Divider } from 'primereact/divider';
import TorrentTable from './TorrentTable';
import { ProgressBar } from 'primereact/progressbar';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { TreeTable, TreeTableSelectionKeysType, TreeTableCheckboxSelectionKeyType, TreeTableSelectionEvent } from 'primereact/treetable';
import TreeNode from "primereact/treenode";
import { Column } from 'primereact/column';
import path from "path-browserify";
import _ from 'lodash';
import {Tree} from 'primereact/tree';

interface TorrentPanelProp {
    detailTorrent: Torrent | null
    torrents: Torrent[]
}

const TorrentPieces: React.FC<TorrentPanelProp> = ({detailTorrent, torrents}) => {
    const [torrentPieces, setTorrentPieces] = useState<PieceState[]>([]);
    useEffect(() => {
        detailTorrent && torrentsPieceStates(detailTorrent.hash).then(setTorrentPieces);
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
        detailTorrent && torrentsProperties(detailTorrent.hash).then(setTorrentProp);
    }, [detailTorrent, torrents]);

    const F = (field: string, content: any, valueOpts?: object) => {
        return [
            <td className='torrent-field' key={field}>{field}:</td>,
            <td className='torrent-value' key={`value-${content}`} {...valueOpts}>{content}</td>
        ];
    };

    return (
        <>
        <table className='w-full'>
            <tbody>
                <tr>
                    {F('Name', detailTorrent?.name, {colSpan: 3})}
                </tr>
                <tr>
                    {F('Save Path', detailTorrent?.save_path, {colSpan: 3})}
                </tr>
                <tr>
                    {F('Hash', detailTorrent?.hash)}
                    {F('Reannounce In', torrentProp && parseDuration(torrentProp.reannounce))}
                </tr>
                <tr>
                    {F('Time Active', torrentProp && `${parseDuration(torrentProp.time_elapsed, 2)} (seeded for ${parseDuration(torrentProp?.seeding_time, 2)})`)}
                    {F('ETA', torrentProp && parseETA(torrentProp.eta))}
                </tr>
                <tr>
                    {F('Added On', detailTorrent && parseEpoch(detailTorrent.added_on))}
                    {F('Last Activity', detailTorrent && parseEpoch(detailTorrent.last_activity))}
                </tr>
                <tr>
                    {F('Downloaded', detailTorrent && `${parseSize(detailTorrent.downloaded)} / ${parseSize(detailTorrent.size)}`)}
                    {F('Total Size', detailTorrent && parseSize(detailTorrent.total_size))}
                </tr>
                <tr>
                    {F('Uploaded', detailTorrent && parseSize(detailTorrent.uploaded))}
                    {F('Share Ratio', torrentProp?.share_ratio.toFixed(2))}
                </tr>
                <tr>
                    {F('Upload Speed', torrentProp && `${parseSpeed(torrentProp.up_speed)} (${parseSpeed(torrentProp.up_speed_avg)} avg.)`)}
                    {F('Download Speed', torrentProp && `${parseSpeed(torrentProp.dl_speed)} (${parseSpeed(torrentProp.dl_speed_avg)} avg.)`)}
                </tr>
                <tr>
                    {F('Seeds', torrentProp && `${torrentProp.seeds} (${torrentProp.seeds_total} total)`)}
                    {F('Peers', torrentProp && `${torrentProp.peers} (${torrentProp.peers_total} total)`)}
                </tr>
                <tr>
                    {F('Create On', torrentProp && parseEpoch(torrentProp.creation_date))}
                    {F('Create By', torrentProp?.created_by)}
                </tr>
                <tr>
                    {F('Pieces', torrentProp && `${torrentProp.pieces_num} x ${parseSize(torrentProp.piece_size)} (have ${torrentProp.pieces_have})`)}
                    {F('Status', detailTorrent?.state)}
                </tr>
                <tr>
                    {F('Comment', torrentProp?.comment, {colSpan: 3})}
                </tr>
            </tbody>
        </table>
        <Divider type='dotted'/>
        <TorrentPieces torrents={torrents} detailTorrent={detailTorrent}/>
        </>
    );
}

const TorrentTrackers: React.FC<TorrentPanelProp> = ({detailTorrent, torrents}) => {
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    useEffect(() => {
        detailTorrent && torrentsTrackers(detailTorrent.hash).then(setTrackers);
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

class FolderData {
    index: number = -1;
    name: string;
    size: number = 0;
    progress: number = 0;
    hash: string;
    priority: FilePriority | undefined = undefined;
    availability: number = 0;
    constructor(name: string, hash: string) {
        this.name = name;
        this.hash = hash;
    }
};

const getFileTree = (files: File[], hash: string): [TreeNode[], TreeTableSelectionKeysType] => {
    let fileTree: TreeNode[] = [];
    let selectedFiles: Record<string, TreeTableCheckboxSelectionKeyType> = {};

    const folderNodes: Record<string, TreeNode> = {};
    const folderData: Record<string, FolderData> = { };

    for (const file of files) {
        let folderPath = '';
        for (const folder of file.name.split('/')) { // TODO: handle win path
            const next = path.join(folderPath, folder);
            if (! (next in folderData)) {
                folderData[next] = new FolderData(folder, hash);
                const folderItem: TreeNode = {
                    key: next,
                    data: folderData[next],
                    children: []
                };
                if (folderPath === '') {
                    fileTree.push(folderItem);
                } else {
                    folderNodes[folderPath].children?.push(folderItem);
                }
                folderNodes[next] = folderItem;
                selectedFiles[next] = { checked: true }
            }
            const data = folderData[next];
            data.size += file.size;
            const childNum = (folderNodes[next].children ?? []).length;
            data.progress = (data.progress * childNum + file.progress) / (childNum + 1);

            if (file.availability !== -1) {
                data.availability += file.availability;
            }

            if (data.priority === undefined) {
                data.priority = file.priority;
            } else if (data.priority !== file.priority) {
                data.priority = FilePriority.Mixed;
            }

            const isChecked = file.priority !== FilePriority.DoNotDownload;
            if (file.name === next) {
                data.index = file.index;
                selectedFiles[next].checked = isChecked;
            } else {
                if (selectedFiles[next].checked !== isChecked) {
                    selectedFiles[next].checked = false;
                    selectedFiles[next].partialChecked = (data.priority !== FilePriority.DoNotDownload);
                }
            }

            folderPath = next;
        }
    }
    return [fileTree, selectedFiles];
};

const TorrentFiles: React.FC<TorrentPanelProp> = ({detailTorrent, torrents}) => {
    const [fileTree, setFileTree] = useState<TreeNode[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<TreeTableSelectionKeysType | null>(null);;
    useEffect(() => {
        detailTorrent && torrentFiles(detailTorrent.hash)
        .then((files) => {
            const [fileTree, selectedFiles] = getFileTree(files, detailTorrent.hash);
            setFileTree(fileTree);
            setSelectedFiles(selectedFiles);
        });
    }, [detailTorrent, torrents]);

    const parseField = (field: keyof FolderData, node: TreeNode) => {
        const content = node.data[field];
        switch (field) {
            case 'name':
                return (<><span className={`text-xl pi ${node.children?.length === 0 ? 'pi-file' : 'pi-folder'}`}/> {content}</>);
            case 'size':
                return parseSize(content);
            case 'progress':
                return (<ProgressBar value={(content * 100).toFixed(2)}/>);
            case 'priority':
                return FilePriority[content];
            default:
                return content;
        }
    }

    const columns: { field: keyof FolderData, label: string, expander?: boolean }[] = [
        { field: 'name', label: 'Name', expander: true },
        { field: 'size', label: 'Size' },
        { field: 'progress', label: 'Progress' },
        { field: 'priority', label: 'Priority' },
        { field: 'availability', label: 'Availability' },
    ];

    const onSelect = (node: TreeNode, selected: boolean) => {
        console.log(node, selected);
        const dfs = (node: TreeNode) => {
            let res = node.data.index === -1 ? [] : [node.data.index];
            for (const c of node.children ?? []) {
                res.push(...dfs(c));
            }
            return res;
        }
        const ids = dfs(node);
        setFilePrio(node.data.hash, ids, selected ? FilePriority.Normal : FilePriority.DoNotDownload);
    };

    return (
        <TreeTable
            value={fileTree}
            className='torrent-files h-full'
            removableSort
            resizableColumns
            columnResizeMode='expand'
            selectionMode='checkbox'
            selectionKeys={selectedFiles}
            onSelect={e => onSelect(e.node, true)}
            onUnselect={e => onSelect(e.node, false)}
        >
            { columns.map(column => (
                <Column
                    sortable
                    className={`torrent-files-${column.field}`}
                    key={column.field}
                    field={column.field}
                    header={column.label}
                    expander={column.expander}
                    body={_.partial(parseField, column.field)}
                />
            )) }
        </TreeTable>
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
            <TabPanel header="Files" className='h-full'>
                <TorrentFiles {...props}/>
            </TabPanel>
        </TabView>
    );
}

export default TorrentPanel;
