import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/videos/")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Error loading videos:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          💫 User Dashboard
        </h1>
        {videos.length === 0 ? (
          <p className="text-center text-gray-500">No videos available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="bg-white shadow-md rounded-2xl p-4 text-center"
              >
                <video
                  src={`http://127.0.0.1:8000${vid.video_path}`}
                  controls
                  className="w-full rounded-xl mb-3"
                />
                <p className="font-medium text-gray-700">{vid.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
