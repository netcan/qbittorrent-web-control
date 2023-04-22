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
                    <td className='torrent-field'>ETA:</td><td className='torrent-value'>{torrentProp && `${torrentProp.eta === 8640000 ? '∞' : parseDuration(torrentProp.eta)}`}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Added On:</td><td className='torrent-value'>{detailTorrent && parseEpoch(detailTorrent.added_on)}</td>
                    <td className='torrent-field'>Last Activity:</td><td className='torrent-value'>{detailTorrent && parseEpoch(detailTorrent.last_activity)}</td>
                </tr>
                <tr>
                    <td className='torrent-field'>Completed Size:</td><td className='torrent-value'>{detailTorrent && parseSize(detailTorrent.size)}</td>
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
            </tbody>
        </table>
    );
}

const TorrentPanel: React.FC<TorrentPanelProp> = (props) => {
    return (
        <TabView className='h-full flex flex-column torrent-tab-panel'>
            <TabPanel header="General">
                <DetailTorrent {...props}/>
            </TabPanel>
        </TabView>
    );
}

export default TorrentPanel;
