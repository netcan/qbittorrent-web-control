import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const TorrentList: React.FC = () => {
    const columns: GridColDef[] = useMemo(() => [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'total_size', headerName: 'Size', flex: 0.5 },
        { field: 'progress', headerName: 'Progress', flex: 0.5 },
    ], []);
    const [torrents, setTorrents] = useState([]);
    const fetchTorrents = async () => {
        try {
            const response = await fetch('/api/v2/torrents/info');
            if (response.ok) {
                const torrentsData = await response.json();
                const torrentsWithId = torrentsData.map((torrent: any) => {
                    const { hash: id, ...res } = torrent;
                    return {id, ...res};
                })
                setTorrents(torrentsWithId);
            } else {
                console.error('Failed to fetch torrents data');
            }
        } catch (error) {
            console.error('Error while fetching torrents data', error);
        }
    };
    useEffect(() => {
        fetchTorrents();
        setInterval(fetchTorrents, 5000);
    }, []);

    return <DataGrid
        rows={torrents}
        columns={columns}
        initialState={{
            pagination: {
                paginationModel: {
                    pageSize: 100
                }
            },
        }}
        density = 'compact'
        autoHeight
    />;
};

export default TorrentList;
