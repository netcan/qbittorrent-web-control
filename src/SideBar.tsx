/*************************************************************************
    > Copyright (c) 2023 Netcan
    > File Name: SideBar.tsx
    > Blog: https://netcan.github.io/
    > Mail: netcan1996@gmail.com
************************************************************************/

import { useEffect, useState, Dispatch, SetStateAction  } from "react";
import { Tree, TreeNodeTemplateOptions } from 'primereact/tree';
import { DataTableFilterMeta } from 'primereact/datatable';
import { Badge } from 'primereact/badge';
import { TreeNode } from "primereact/treenode";
import { FilterMatchMode, FilterService } from "primereact/api";
import * as Torrent from './Torrent';
import { StatusGroup, StatusTable } from './Torrent';
import { createFilter, getHostName, isSameClass, parseSize } from "./Utils";
import path from "path-browserify";

class ItemData {
    counter: number = 0;
    size: number = 0;
};

class StatusData extends ItemData { };
class TrackersData extends ItemData { };
class FoldersData extends ItemData { };

const getItems = (torrents: Torrent.Torrent[]) => {
    const getItem = <T extends ItemData>(keyName: string, labelName: string, icon: string,
                                         data: T, children: TreeNode[] = []): TreeNode => {
        return {
            key: keyName,
            label: `${labelName}`,
            data: data,
            icon: `pi ${icon}`,
            children: children
        };
    }

    const statusData = Object.values(StatusGroup).reduce(
         (data, status) => ({ ...data, [status]: new StatusData() }),
         {} as Record<StatusGroup, StatusData>
    );

    const statusItem = getItem('status', 'All', 'pi-home', new ItemData(), ([
        [StatusGroup.DOWNLOAD, 'Downloading'],
        [StatusGroup.PAUSE,    'Paused'],
        [StatusGroup.UPLOAD,   'Seeding'],
        [StatusGroup.CHECK,    'Checking'],
        [StatusGroup.ACTIVE,   'Active'],
        [StatusGroup.ERROR,    'Error'],
    ] as [StatusGroup, string][]).map(([sg, label]) =>
        getItem(sg, label, StatusTable[sg].icon, statusData[sg])
    ));

    const trackerData: Record<string, TrackersData> = { };
    const trackersItem = getItem('trackers', 'Trackers', 'pi-globe', new ItemData());

    const folderData: Record<string, FoldersData> = { };
    let folderNodes: { [key: string]: TreeNode; } = { };
    const foldersItem = getItem('folders', 'Folders', 'pi-folder', new ItemData());

    for (const torrent of torrents) {
        Object.values(StatusGroup).forEach((sg) => {
            StatusTable.is(torrent.state, sg) && ++statusData[sg].counter;
        });

        {
            const tracker = getHostName(torrent.tracker);
            if (! (tracker in trackerData)) {
                trackerData[tracker] = new TrackersData();
                trackersItem.children?.push(
                    getItem(tracker, tracker, 'pi-server', trackerData[tracker])
                );
            }
            ++trackerData[tracker].counter;
            trackerData[tracker].size += torrent.size;
        }

        {
            let folderPath = '';
            for (const folder of torrent.save_path.split('/').filter(folder => folder !== '')) { // TODO: handle win path
                const next = path.join(folderPath, folder);
                if (! (next in folderData)) {
                    folderData[next] = new FoldersData();
                    const folderItem = getItem(next, folder, 'pi-folder', folderData[next], []);
                    if (folderPath === '') {
                        foldersItem.children?.push(folderItem)
                    } else {
                        folderNodes[folderPath].children?.push(folderItem);
                    }
                    folderNodes[next] = folderItem;
                }
                ++folderData[next].counter;
                folderData[next].size += torrent.size;
                folderPath = next;
            }
        }
    }

    return [
        statusItem,
        trackersItem,
        foldersItem
    ];
};

interface SideBarProps {
    torrents: Torrent.Torrent[],
    setFilters: Dispatch<SetStateAction<DataTableFilterMeta>>,
};

const SideBar: React.FC<SideBarProps> = ({ torrents, setFilters }) => {
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [selectedItemKey, setSelectedItemKey] = useState('');
    const [lastSelectedItem, setLastSelectedItem] = useState<TreeNode>();

    const createTrackerFilter = (tracker: string) => {
        FilterService.register('trackerFilter', (tracker, value) => {
            if (value === '') { return true; }
            return getHostName(tracker) === value;
        });
        return {
            value: tracker,
            matchMode: 'trackerFilter' as FilterMatchMode
        };
    };

    const createStatusFilter = (sg: StatusGroup) => {
        FilterService.register('statusFilter', (state: Torrent.TorrentState, sg) => {
            if (sg === '') { return true; }
            return StatusTable.is(state, sg);
        });
        return {
            value: sg,
            matchMode: 'statusFilter' as FilterMatchMode
        };
    }

    const setFilter = <T extends ItemData>(data: T, value: string = '') => {
        if (! data) { return; }
        setFilters((prev) => {
            if (data instanceof StatusData) {
                return { ...prev, state: createStatusFilter(value as StatusGroup) };
            } else if (data instanceof TrackersData) {
                return { ...prev, tracker: createTrackerFilter(value) };
            } else if (data instanceof FoldersData) {
                return { ...prev, save_path: createFilter(value) };
            }
            return prev;
        });
    };

    const onSelect = (node: TreeNode) => {
        if (lastSelectedItem === node) {
            return;
        }

        if (! isSameClass(lastSelectedItem?.data, node.data)) {
            // clear last selected item filter
            setFilter(lastSelectedItem?.data);
        }

        setFilter(node.data, node.key as string);
        setSelectedItemKey(node.key as string);
        setLastSelectedItem(node);
    };

    useEffect(() => {
        setNodes(getItems(torrents));
    }, [torrents]);

    const parseContent = (node: TreeNode, options: TreeNodeTemplateOptions) => {
        return <span className={options.className}>
            {node.label} {node.data?.counter ? <Badge value={node.data?.counter} className='surface-500'></Badge> : ''}
            {node.data?.size ? <span className='item-torrent-size text-500'>[{parseSize(node.data?.size)}]</span> : ''}
        </span>;
    };

    return (
        <Tree value={nodes}
            className="torrent-sidebar"
            style={{all: 'unset'}}
            selectionMode="single"
            selectionKeys={selectedItemKey}
            onSelect={(e) => onSelect(e.node)}
            nodeTemplate={parseContent}
        />
    );
};

export default SideBar;
