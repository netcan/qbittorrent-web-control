import { useEffect, useState } from "react";
import { Tree, TreeNodeTemplateOptions } from 'primereact/tree';
import { Badge } from 'primereact/badge';
import TreeNode from "primereact/treenode";
import * as Torrent from './Torrent';
import { getHostName } from "./Utils";
import path from "path-browserify";

interface SideBarProps {
    torrents: Torrent.Torrent[],
};

class ItemInfo {
    counter: number = 0;
    size: number = 0;
};

type ItemData = {
    [key: string]: ItemInfo
};

const getItem = (keyName: string, labelName: string, icon: string,
                 data: ItemData, children: TreeNode[] = []): TreeNode => {
    return {
        key: keyName,
        label: `${labelName}`,
        data: data[keyName],
        icon: `pi ${icon}`,
        children: children
    };
}

const getItems = (torrents: Torrent.Torrent[]) => {
    const statusData: ItemData = {
        'download': new ItemInfo(),
        'pause': new ItemInfo(),
        'upload': new ItemInfo(),
        'check': new ItemInfo(),
        'active': new ItemInfo(),
        'error': new ItemInfo(),
    };
    const trackerData: ItemData = { };
    const folderData: ItemData = { };

    const trackerSet = new Set<string>();
    const folderSet = new Set<string>();
    for (const torrent of torrents) {
        Torrent.isDownload(torrent) && ++statusData['download'].counter;
        Torrent.isPaused(torrent)   && ++statusData['pause'].counter;
        Torrent.isUpload(torrent)   && ++statusData['upload'].counter;
        Torrent.isChecking(torrent) && ++statusData['check'].counter;
        Torrent.isActivate(torrent) && ++statusData['active'].counter;
        Torrent.isError(torrent)    && ++statusData['error'].counter;

        {
            const tracker = getHostName(torrent.tracker);
            if (! trackerSet.has(tracker)) {
                trackerSet.add(tracker)
                trackerData[tracker] = new ItemInfo;
            }
            ++trackerData[tracker].counter;
        }

        {
            folderSet.add(torrent.save_path);
            let folderPath = '';
            for (const folder of torrent.save_path.split('/')) { // TODO: handle win path
                if (folder === '') {
                    continue;
                }
                const next = path.join(folderPath, folder);
                if (! (next in folderData)) {
                    folderData[next] = new ItemInfo;
                }
                ++folderData[next].counter;
                folderPath = next;
            }
        }
    }

    const status = getItem('status', 'All', 'pi-home', {}, [
        getItem('download', 'Downloading', Torrent.downloadIcon, statusData),
        getItem('pause',    'Paused',      Torrent.pausedIcon,   statusData),
        getItem('upload',   'Seeding',     Torrent.uploadIcon,   statusData),
        getItem('check',    'Checking',    Torrent.checkingIcon, statusData),
        getItem('active',   'Active',      Torrent.activeIcon,   statusData),
        getItem('error',    'Error',       Torrent.errorIcon,    statusData),
    ]);

    const trackersList = [...trackerSet];
    const trackers = getItem('trackers', 'Trackers', 'pi-globe', {},
                            trackersList.map((tracker) => {
                                return getItem(tracker, tracker, 'pi-server', trackerData)
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
                next = getItem(key, folder, 'pi-folder', folderData, []);
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
            onSelectionChange={(e) => onSelectionItem(e.value as string)}
            nodeTemplate={parseContent}
        />
    );
};

export default SideBar;
