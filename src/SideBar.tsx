import { useEffect, useState } from "react";
import { Tree } from 'primereact/tree';
import TreeNode from "primereact/treenode";
import * as Torrent from './Torrent';
import {getHostName} from "./Utils";

interface SideBarProps {
    torrents: Torrent.Torrent[],
};

const parseLen = (torrents: Torrent.Torrent[], predicate: (_: Torrent.Torrent) => boolean) => {
    const len = torrents.filter((torrent) => { return predicate(torrent); }).length;
    return len == 0 ? '' : ` (${len})`;
};

const getItem = (torrents: Torrent.Torrent[], keyName: string, labelName: string, icon: string,
                      predicate: (_: Torrent.Torrent) => boolean,
                      children: TreeNode[] = []
                     ): TreeNode => {
    return {
        key: keyName,
        label: `${labelName}${parseLen(torrents, predicate)}`,
        icon: `pi ${icon}`,
        children: children
    };
}

const SideBar: React.FC<SideBarProps> = ({ torrents }) => {
    const [nodes, setNodes] = useState<TreeNode[]>([]);

    const item = getItem.bind(null, torrents);

    useEffect(() => {
        const status = item('status', 'All', 'pi-home', (_) => { return true; }, [
            item('download', 'Downloading', Torrent.downloadIcon, Torrent.isDownload),
            item('paused',   'Paused',      Torrent.pausedIcon,   Torrent.isPaused),
            item('upload',   'Seeding',     Torrent.uploadIcon,   Torrent.isUpload),
            item('check',    'Checking',    Torrent.checkingIcon, Torrent.isChecking),
            item('active',   'Active',      Torrent.activeIcon,   Torrent.isActivate),
            item('error',    'Error',       Torrent.errorIcon,    Torrent.isError),
        ]);

        const trackersList = [...new Set(torrents.map((torrent) => {
            return getHostName(torrent.tracker);
        }))];
        const trackers = item('trackers', 'Trackers', 'pi-globe', (_) => { return false },
                              trackersList.map((tracker) => {
                                  return item(tracker, tracker, 'pi-server', (torrent) => {
                                      return getHostName(torrent.tracker) == tracker;
                                  });
                              }));

        setNodes([
            status,
            trackers,
        ]);
    }, [torrents]);

    return (
        <Tree value={nodes} id="sidebar"/>
    );
};

export default SideBar;
