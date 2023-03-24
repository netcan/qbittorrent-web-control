import React, { useState, useEffect } from 'react';

type Torrent = {
  name: string;
  totalSize: number;
  state: string;
  progress: number;
};

const TorrentList: React.FC = () => {
  const [torrents, setTorrents] = useState<Torrent[]>([]);

  const fetchTorrents = async () => {
    try {
      const response = await fetch('/api/v2/torrents/info?filter=all');
      if (response.ok) {
        const torrentsData = await response.json();
        const torrentsList = torrentsData.map((torrent: any) => ({
          name: torrent.name,
          totalSize: torrent.total_size,
          state: torrent.state,
          progress: torrent.progress * 100,
        }));
        setTorrents(torrentsList);
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

  console.log(torrents);
  return (
    <div>
      <h1>Torrent List</h1>
      <ul>
        {torrents.map((torrent) => (
          <li key={torrent.name}>
            <div>Name: {torrent.name}</div>
            <div>Total Size: {torrent.totalSize} bytes</div>
            <div>State: {torrent.state}</div>
            <div>Progress: {torrent.progress}%</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TorrentList;
