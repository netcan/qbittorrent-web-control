import { Torrent, TorrentGenericProp, torrentsProperties } from './Torrent';
import { TabView, TabPanel } from 'primereact/tabview';
import {parseDuration, parseEpoch, parseSize, parseSpeed} from './Utils';
import {useEffect, useState} from 'react';

interface TorrentPanelProp {
    detailTorrent: Torrent | null
    torrents: Torrent[]
}

const DetailTorrent: React.FC<TorrentPanelProp> = ({detailTorrent, torrents}) => {
    const [torrentProp, setTorrentProp] = useState<TorrentGenericProp>();
    useEffect(() => {
        detailTorrent && torrentsProperties(detailTorrent.hash)
                            .then(res => setTorrentProp(res));
    }, [detailTorrent, torrents]);

    return (
        <table style={{width: "100%"}}>
            <tbody>
                <tr><td>Name:</td><td colSpan={3}>{detailTorrent?.name}</td></tr>
                <tr>
                    <td>Save Path:</td><td colSpan={3}>{detailTorrent?.save_path}</td>
                </tr>
                <tr>
                    <td>Hash:</td><td>{detailTorrent?.hash}</td>
                    <td>Reannounce In:</td><td>{torrentProp && parseDuration(torrentProp.reannounce)}</td>
                </tr>
                <tr>
                    <td>Time Active:</td><td>{torrentProp && `${parseDuration(torrentProp.time_elapsed, 2)} (seeded for ${parseDuration(torrentProp?.seeding_time, 2)})`} </td>
                    <td>ETA:</td><td>{torrentProp && `${torrentProp.eta === 8640000 ? '∞' : parseDuration(torrentProp.eta)}`}</td>
                </tr>
                <tr>
                    <td>Added On:</td><td>{detailTorrent && parseEpoch(detailTorrent.added_on)}</td>
                    <td>Last Activity:</td><td>{detailTorrent && parseEpoch(detailTorrent.last_activity)}</td>
                </tr>
                <tr>
                    <td>Completed Size:</td><td>{detailTorrent && parseSize(detailTorrent.size)}</td>
                    <td>Total Size:</td><td>{detailTorrent && parseSize(detailTorrent.total_size)}</td>
                </tr>
                <tr>
                    <td>Uploaded:</td><td>{detailTorrent && parseSize(detailTorrent.uploaded)}</td>
                    <td>Share Ratio:</td><td>{torrentProp?.share_ratio.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Upload Speed:</td><td>{torrentProp && `${parseSpeed(torrentProp.up_speed)} (${parseSpeed(torrentProp.up_speed_avg)} avg.)`}</td>
                    <td>Download Speed:</td><td>{torrentProp && `${parseSpeed(torrentProp.dl_speed)} (${parseSpeed(torrentProp.dl_speed_avg)} avg.)`}</td>
                </tr>
                <tr>
                    <td>Seeds</td><td>{torrentProp && `${torrentProp.seeds} (${torrentProp.seeds_total} total)`}</td>
                    <td>Peers</td><td>{torrentProp && `${torrentProp.peers} (${torrentProp.peers_total} total)`}</td>
                </tr>
                <tr>
                    <td>Create On:</td><td>{torrentProp && parseEpoch(torrentProp.creation_date)}</td>
                    <td>Create By:</td><td>{torrentProp?.created_by}</td>
                </tr>
                <tr>
                    <td>Pieces:</td><td>{ torrentProp && `${torrentProp.pieces_num} x ${parseSize(torrentProp.piece_size)} (have ${torrentProp.pieces_have})` }</td>
                    <td>Status:</td><td>{detailTorrent?.state}</td>
                </tr>
                <tr>
                    <td>Comment:</td><td colSpan={3}>{torrentProp?.comment}</td>
                </tr>
            </tbody>
        </table>
    );
}

const TorrentPanel: React.FC<TorrentPanelProp> = (props) => {
    return (
        <TabView className='h-full flex flex-column torrent-panel'>
            <TabPanel header="General">
                <DetailTorrent {...props}/>
            </TabPanel>
        </TabView>
    );
}

export default TorrentPanel;
