import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Admin() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch all videos on load
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/videos", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setVideos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload_video", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      // Refresh video list after upload
      axios.get("http://127.0.0.1:8000/videos", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setVideos(res.data));
    } catch (err) {
      setMessage("Upload failed");
      console.error(err);
    }
  };

  const fetchCheckpoints = (video) => {
    axios.get(`http://127.0.0.1:8000/transcript/${video.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCheckpoints(res.data.text.split("\n").map((t,i)=>({index:i,text:t})));
        setSelectedVideo(video.title);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Admin Panel</h1>

      {/* Upload Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-4 mb-6">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleUpload}
          className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
        >
          Upload Video
        </button>
        {message && <p className="text-green-600 font-medium">{message}</p>}
      </div>

      {/* Video List Section */}
      <div className="dashboard-card w-96">
        <h2 className="text-xl font-semibold mb-2">Uploaded Videos</h2>
        <ul className="video-list">
          {videos.map(v => (
            <li
              key={v.id}
              onClick={() => fetchCheckpoints(v)}
              className="cursor-pointer text-purple-700 hover:underline mb-1"
            >
              {v.title}
            </li>
          ))}
        </ul>

        {/* Checkpoints / Transcripts */}
        {selectedVideo && (
          <div className="checkpoints mt-4">
            <h3 className="font-semibold">Checkpoints for {selectedVideo}:</h3>
            <ul>
              {checkpoints.map(c => <li key={c.index}>{c.text}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}





