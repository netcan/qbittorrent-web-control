import React, { useState, useEffect, useMemo } from 'react';
import Table from './Table';

const TorrentList: React.FC = () => {
    const columns = useMemo(() => [
        {
            Header: '名称',
            accessor: 'name',
        },
        {
            Header: '大小',
            accessor: 'total_size',
        },
        {
            Header: '进度',
            accessor: 'progress',
        },
    ], []);
    const [torrents, setTorrents] = useState([]);
    const fetchTorrents = async () => {
        try {
            const response = await fetch('/api/v2/torrents/info');
            if (response.ok) {
                const torrentsData = await response.json();
                setTorrents(torrentsData);
            } else {
                console.error('Failed to fetch torrents data');
            }
        } catch (error) {
            console.error('Error while fetching torrents data', error);
        }
    };
    useEffect(() => {
        fetchTorrents();
    }, []);

    return <Table columns={columns} data={torrents}/>;
};

export default TorrentList;
