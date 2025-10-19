import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get("http://127.0.0.1:8000/videos");
      setVideos(res.data);
    };
    fetchVideos();
  }, []);

  const fetchCheckpoints = async (video) => {
    const res = await axios.get(`http://127.0.0.1:8000/transcript/${video.id}`);
    setCheckpoints(res.data.text.split("\n").map((t, i) => ({ index: i, text: t })));
    setSelectedVideo(video.title);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50 px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700">Tube Tutor</h1>
        <p className="text-lg text-blue-400">AI Summariser</p>
      </div>

      {/* Dashboard Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          Dashboard
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Video List */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Videos:</h3>
            <ul className="list-disc pl-6 space-y-2">
              {videos.map((v) => (
                <li
                  key={v.id}
                  onClick={() => fetchCheckpoints(v)}
                  className="text-purple-600 font-medium cursor-pointer hover:underline"
                >
                  {v.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Checkpoints */}
          {selectedVideo && (
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Checkpoints for {selectedVideo}:
              </h3>
              <ul className="list-decimal pl-6 space-y-1">
                {checkpoints.map((c) => (
                  <li key={c.index} className="text-gray-600">
                    {c.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



