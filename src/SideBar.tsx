import { useEffect, useState } from "react";
import { Tree, TreeSelectionEvent } from 'primereact/tree';
import TreeNode from "primereact/treenode";
import * as Torrent from './Torrent';
import {getHostName} from "./Utils";
import path from "path-browserify";

interface SideBarProps {
    torrents: Torrent.Torrent[],
};

type Counter = {
    [key: string]: number
};

const getItem = (keyName: string, labelName: string, icon: string,
                 counter: Counter, children: TreeNode[] = []): TreeNode => {
    const parseLen = (len: number) => {
        return len ? ` (${len})` : '';
    };
    return {
        key: keyName,
        label: `${labelName}${parseLen(counter[keyName])}`,
        icon: `pi ${icon}`,
        children: children
    };
}

const getItems = (torrents: Torrent.Torrent[]) => {
    const inc = (c: Counter, key: string) => {
        if (c[key] === undefined) c[key] = 0;
        ++c[key];
    }
    const statusCount: Counter = { };
    const trackerCount: Counter = { };
    const folderCount: Counter = { };

    const trackerSet = new Set<string>();
    const folderSet = new Set<string>();
    for (const torrent of torrents) {
        Torrent.isDownload(torrent) && inc(statusCount, 'download');
        Torrent.isPaused(torrent)   && inc(statusCount, 'pause');
        Torrent.isUpload(torrent)   && inc(statusCount, 'upload');
        Torrent.isChecking(torrent) && inc(statusCount, 'check');
        Torrent.isActivate(torrent) && inc(statusCount, 'active');
        Torrent.isError(torrent)    && inc(statusCount, 'error');

        {
            const tracker = getHostName(torrent.tracker);
            trackerSet.add(tracker)
            inc(trackerCount, tracker);
        }

        {
            folderSet.add(torrent.save_path);
            let folderPath = '';
            for (const folder of torrent.save_path.split('/')) { // TODO: handle win path
                if (folder === '') {
                    continue;
                }
                const next = path.join(folderPath, folder);
                inc(folderCount, next);
                folderPath = next;
            }
        }
    }

    const status = getItem('status', 'All', 'pi-home', {}, [
        getItem('download', 'Downloading', Torrent.downloadIcon, statusCount),
        getItem('pause',    'Paused',      Torrent.pausedIcon,   statusCount),
        getItem('upload',   'Seeding',     Torrent.uploadIcon,   statusCount),
        getItem('check',    'Checking',    Torrent.checkingIcon, statusCount),
        getItem('active',   'Active',      Torrent.activeIcon,   statusCount),
        getItem('error',    'Error',       Torrent.errorIcon,    statusCount),
    ]);

    const trackersList = [...trackerSet];
    const trackers = getItem('trackers', 'Trackers', 'pi-globe', {},
                            trackersList.map((tracker) => {
                                return getItem(tracker, tracker, 'pi-server', trackerCount)
                            }));

    const folders = getItem('folders', 'Folders', 'pi-folder', {}, []);
    const foldersList = [...folderSet];

    for (const savedPath of foldersList) {
        let folderItem = folders;
        for (const folder of savedPath.split('/')) {
            if (folder === '') {
                continue;
            }
            let next = folderItem.children?.find((getItem) => {
                return getItem.label?.includes(folder);
            });
            if (!next) {
                const key = folderItem === folders ? folder : path.join(folderItem.key as string, folder);
                next = getItem(key, folder, 'pi-folder', folderCount, []);
                folderItem.children?.push(next);
            }
            folderItem = next;
        }
    }

    return [
        status,
        trackers,
        folders
    ];
};


const SideBar: React.FC<SideBarProps> = ({ torrents }) => {
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [selectedItemKey, setSelectedItemKey] = useState('');

    const onSelectionItem = (key: string) => {
        setSelectedItemKey(key);
    };

    useEffect(() => {
        setNodes(getItems(torrents));
    }, [torrents]);

    return (
        <Tree value={nodes}
            id="sidebar"
            selectionMode="single"
            selectionKeys={selectedItemKey}
            onSelectionChange={(e) => onSelectionItem(e.value as string)}
        />
    );
};

export default SideBar;
