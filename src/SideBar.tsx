import { useEffect, useState, Dispatch, SetStateAction  } from "react";
import { Tree, TreeNodeTemplateOptions } from 'primereact/tree';
import { DataTableFilterMeta } from 'primereact/datatable';
import { Badge } from 'primereact/badge';
import TreeNode from "primereact/treenode";
import { FilterMatchMode, FilterService } from "primereact/api";
import * as Torrent from './Torrent';
import { StatusGroup, StatusTable } from './Torrent';
import { createFilter, getHostName, isSameClass } from "./Utils";
import path from "path-browserify";

class ItemInfo {
    counter: number = 0;
    size: number = 0;
};

class StatusInfo extends ItemInfo {
    kind = 'StatusInfo' as const
};
class TrackersInfo extends ItemInfo {
    kind = 'TrackersInfo' as const
};
class FoldersInfo extends ItemInfo {
    kind = 'FoldersInfo' as const
};

const getItems = (torrents: Torrent.Torrent[]) => {
    const getItem = <T extends ItemInfo>(keyName: string, labelName: string, icon: string,
                                         data: Record<string, T> = {}, children: TreeNode[] = []): TreeNode => {
        return {
            key: keyName,
            label: `${labelName}`,
            data: data[keyName],
            icon: `pi ${icon}`,
            children: children
        };
    }

    const statusData = Object.values(StatusGroup).reduce(
         (data, status) => ({ ...data, [status]: new TrackersInfo() }),
         {} as Record<StatusGroup, StatusInfo>
    );

    const status = getItem('status', 'All', 'pi-home', {}, [
        getItem(StatusGroup.DOWNLOAD, 'Downloading', StatusTable[StatusGroup.DOWNLOAD].icon, statusData),
        getItem(StatusGroup.PAUSE,    'Paused',      StatusTable[StatusGroup.PAUSE].icon,    statusData),
        getItem(StatusGroup.UPLOAD,   'Seeding',     StatusTable[StatusGroup.UPLOAD].icon,   statusData),
        getItem(StatusGroup.CHECK,    'Checking',    StatusTable[StatusGroup.CHECK].icon,    statusData),
        getItem(StatusGroup.ACTIVE,   'Active',      StatusTable[StatusGroup.ACTIVE].icon,   statusData),
        getItem(StatusGroup.ERROR,    'Error',       StatusTable[StatusGroup.ERROR].icon,    statusData),
    ]);

    const trackerData: Record<string, TrackersInfo> = { };
    const trackers = getItem('trackers', 'Trackers', 'pi-globe');

    const folderData: Record<string, FoldersInfo> = { };
    let folderNodes: { [key: string]: TreeNode; } = {};
    const folders = getItem('folders', 'Folders', 'pi-folder');

    for (const torrent of torrents) {
        Object.values(StatusGroup).forEach((sg) => {
            StatusTable.is(torrent.state, sg) && ++statusData[sg].counter;
        });

        {
            const tracker = getHostName(torrent.tracker);
            if (! (tracker in trackerData)) {
                trackerData[tracker] = new TrackersInfo();
                trackers.children?.push(
                    getItem(tracker, tracker, 'pi-server', trackerData)
                );
            }
            ++trackerData[tracker].counter;
        }

        {
            let folderPath = '';
            for (const folder of torrent.save_path.split('/')) { // TODO: handle win path
                if (folder === '') {
                    continue;
                }
                const next = path.join(folderPath, folder);
                if (! (next in folderData)) {
                    folderData[next] = new FoldersInfo();
                    const folderItem = getItem(next, folder, 'pi-folder', folderData, []);
                    if (folderPath === '') {
                        folders.children?.push(folderItem)
                    } else {
                        folderNodes[folderPath].children?.push(folderItem);
                    }
                    folderNodes[next] = folderItem;
                }
                ++folderData[next].counter;
                folderPath = next;
            }
        }
    }

    return [
        status,
        trackers,
        folders
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

    const setFilter = <T extends ItemInfo>(info: T, value: string = '') => {
        if (! info) { return; }
        setFilters((prev) => {
            if (info instanceof StatusInfo) {
                return { ...prev, state: createFilter(value) };
            } else if (info instanceof TrackersInfo) {
                return { ...prev, tracker: createTrackerFilter(value) };
            } else if (info instanceof FoldersInfo) {
                return { ...prev, save_path: createFilter(value) };
            }
            return prev;
        });
    };

    const onSelect = (node: TreeNode) => {
        if (lastSelectedItem === node) {
            return;
        }
        // clear last selected item filter
        if (! isSameClass(lastSelectedItem?.data, node.data)) {
            setFilter(lastSelectedItem?.data);
        }

        setFilter(node.data, node.key as string);
        setSelectedItemKey(node.key as string);
        setLastSelectedItem(node);
    };

    useEffect(() => {
        setNodes(getItems(torrents));
    }, [torrents]);

    const parseLen = (len: number) => {
        return len ? (<Badge value={len} className='surface-500'></Badge>) : (<></>);
    };
    const parseContent = (node: TreeNode, options: TreeNodeTemplateOptions) => {
        return <span className={options.className}>
            {node.label} {parseLen(node.data?.counter)}
        </span>;
    };

    return (
        <Tree value={nodes}
            id="sidebar"
            selectionMode="single"
            selectionKeys={selectedItemKey}
            onSelect={(e) => onSelect(e.node)}
            nodeTemplate={parseContent}
        />
    );
};

export default SideBar;
