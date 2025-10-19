import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/videos');
        setVideos(res.data);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-10">
      <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">Dashboard</h1>
      {videos.length === 0 ? (
        <p className="text-gray-500 text-center">No videos available</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v, idx) => (
            <li
              key={idx}
              className="bg-white shadow-md rounded-xl p-4 text-purple-800 font-medium hover:scale-105 transition-transform"
            >
              {v}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

